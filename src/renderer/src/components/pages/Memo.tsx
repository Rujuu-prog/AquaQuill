import { useCallback, useEffect, useState } from 'react'
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
  const initialTabs: Tab[] = [
    { value: uuidv4(), label: 'Memo 1', content: '' },
    { value: uuidv4(), label: 'Memo 2', content: '' }
  ]

  const [tabs, setTabs] = useState(initialTabs)
  const [activeTab, setActiveTab] = useState<string | null>(tabs[0].value)

  const createNewTab = (): Tab => ({
    value: uuidv4(),
    label: `New Memo`,
    content: ''
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
    [tabs]
  )

  const addTab = useCallback((filePath?: string, content: string = ''): void => {
    if (filePath && typeof filePath !== 'string') {
      // filePathがSyntheticBaseEventの場合はundefinedにする
      filePath = undefined
    }
    filePath = extractFileName(filePath || '')
    const newTab = createNewTab()
    newTab.label = filePath || newTab.label
    newTab.content = content
    setTabs((prevTabs) => [...prevTabs, newTab])
    setActiveTab(newTab.value)
  }, [tabs])

  const updateTabContent = useCallback((tabValue: string, content: string): void => {
    setTabs((currentTabs) =>
      currentTabs.map((tab) => (tab.value === tabValue ? { ...tab, content } : tab))
    )
  }, [tabs])

  const saveMemo = useCallback(async (): Promise<void> => {
    const currentPane = tabs.find((tab) => tab.value === activeTab)
    if (currentPane) {
      const markdownContent = htmlToMarkdown(currentPane.content)
      const savedFilePath = await window.electronAPI.saveFile(markdownContent, currentPane.filePath)
      if (savedFilePath) {
        setTabs((currentTabs) =>
          currentTabs.map((tab) =>
            tab.value === currentPane.value
              ? {
                  ...tab,
                  filePath: savedFilePath,
                  label: extractFileName(savedFilePath) || tab.label
                }
              : tab
          )
        )
      }
    }
  }, [tabs, activeTab])

  const handleFileOpen = useCallback(
    (_e: Electron.IpcRendererEvent, filePath: string, data: string): void => {
      const htmlContent = markdownToHtml(data)
      addTab(filePath, htmlContent)
    },
    [tabs, addTab]
  )

  useEffect(() => {
    // Electron APIリスナーの設定
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

    // クリーンアップ
    return (): void => {
      window.electronAPI.removeSaveRequestListener(handleSaveRequest)
      window.electronAPI.removeNewTabRequestListener(handleNewTabRequest)
      window.electronAPI.removeFileOpenListener(handleFileOpenRequest)
    }
  }, [])

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
