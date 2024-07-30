import { useCallback, useEffect, useState, useRef } from 'react'
import TabsContainer from '../tab/TabsContainer'
import { v4 as uuidv4 } from 'uuid'

// util
import markdownToHtml from '../../utils/markdownToHtml'
import htmlToMarkdown from '../../utils/htmlToMarkdown'
import extractFileName from '../../utils/extractFileName'

interface Tab {
  value: string
  label: string
  content: string
  filePath?: string
}

export default function Memo(): JSX.Element {
  const initialTabs: Tab[] = [{ value: uuidv4(), label: 'New Memo', content: '' }]

  const [tabs, setTabs] = useState(initialTabs)
  const [activeTab, setActiveTab] = useState<string | null>(tabs[0].value)
  const tabsRef = useRef(tabs)

  // TODO: useEffectとuseRefを使わないでtabsを監視する方法を考える
  useEffect(() => {
    tabsRef.current = tabs
  }, [tabs])

  const createNewTab = (): Tab => ({
    value: uuidv4(),
    label: `New Memo`,
    content: '',
    filePath: undefined
  })

  const removeTab = useCallback(
    (tabValue: string): void => {
      setTabs((currentTabs) => {
        const newTabs = currentTabs.filter((tab) => tab.value !== tabValue)
        if (newTabs.length === 0) {
          const newTab = createNewTab()
          setActiveTab(newTab.value)
          return [newTab]
        }
        if (activeTab === tabValue) {
          const removedTabIndex = currentTabs.findIndex((tab) => tab.value === tabValue)
          const newActiveIndex = removedTabIndex > 0 ? removedTabIndex - 1 : 0
          setActiveTab(newTabs[newActiveIndex]?.value || null)
        }
        return newTabs
      })
    },
    [activeTab]
  )

  const addTab = useCallback((filePath?: string, content: string = ''): void => {
    if (filePath && typeof filePath !== 'string') {
      filePath = undefined
    }
    filePath = extractFileName(filePath || '')
    const newTab = createNewTab()
    newTab.label = filePath || newTab.label
    newTab.content = content
    setTabs((prevTabs) => [...prevTabs, newTab])
    setActiveTab(newTab.value)
  }, [])

  const updateTabContent = useCallback(
    (tabValue: string, content: string, filePath?: string, label?: string): void => {
      setTabs((currentTabs) =>
        currentTabs.map((tab) =>
          tab.value === tabValue
            ? { ...tab, content, label: label ?? tab.label, filePath: filePath ?? tab.filePath }
            : tab
        )
      )
    },
    []
  )

  const saveMemo = useCallback(async (): Promise<void> => {
    const currentPane = tabsRef.current.find((tab) => tab.value === activeTab)
    if (currentPane) {
      const markdownContent = htmlToMarkdown(currentPane.content)
      const savedFilePath = await window.electronAPI.saveFile(markdownContent, currentPane.filePath)
      if (savedFilePath) {
        updateTabContent(
          currentPane.value,
          currentPane.content,
          savedFilePath,
          extractFileName(savedFilePath)
        )
      }
    }
  }, [activeTab])

  const handleFileOpen = useCallback(
    (_e: Electron.IpcRendererEvent, filePath: string, data: string): void => {
      const htmlContent = markdownToHtml(data)
      addTab(filePath, htmlContent)
    },
    [addTab]
  )

  useEffect(() => {
    const handleSaveRequest = () => {
      saveMemo()
    }

    const handleNewTabRequest = () => {
      addTab()
    }

    const handleFileOpenRequest = (
      _e: Electron.IpcRendererEvent,
      filePath: string,
      data: string
    ) => {
      handleFileOpen(_e, filePath, data)
    }

    window.electronAPI.onSaveRequest(handleSaveRequest)
    window.electronAPI.onNewTabRequested(handleNewTabRequest)
    window.electronAPI.onFileOpen(handleFileOpenRequest)

    return (): void => {
      window.electronAPI.removeSaveRequestListener(handleSaveRequest)
      window.electronAPI.removeNewTabRequestListener(handleNewTabRequest)
      window.electronAPI.removeFileOpenListener(handleFileOpenRequest)
    }
  }, [saveMemo, addTab, handleFileOpen])

  return (
    <div>
      <TabsContainer
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        removeTab={removeTab}
        addTab={addTab}
        updateTabContent={updateTabContent}
      />
    </div>
  )
}
