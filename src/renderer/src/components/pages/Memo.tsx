import { useState, useEffect } from 'react'
import TabsContainer from '../tab/TabsContainer'
import { v4 as uuidv4 } from 'uuid'

// util
import markdownToHtml from '../../utils/markdownToHtml'
import htmlToMarkdown from '../../utils/htmlToMarkdown'
import extractFileName from '../../utils/ExtractFileName'

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

  const removeTab = (tabValue: string): void => {
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
  }

  const addTab = (filePath?: string, content: string = ''): void => {
    if (filePath && typeof filePath !== 'string') {
      // filePathがSyntheticBaseEventの場合はundefinedにする
      filePath = undefined
    }
    filePath = extractFileName(filePath || '')
    const newTab = createNewTab()
    newTab.label = filePath || newTab.label
    newTab.content = content
    setTabs([...tabs, newTab])
    setActiveTab(newTab.value)
  }

  const updateTabContent = (tabValue: string, content: string): void => {
    setTabs((currentTabs) =>
      currentTabs.map((tab) => (tab.value === tabValue ? { ...tab, content } : tab))
    )
  }

  const saveMemo = async (): Promise<void> => {
    const currentPane = tabs.find((tab) => tab.value === activeTab)
    if (currentPane) {
      const markdownContent = htmlToMarkdown(currentPane.content)
      const savedFilePath = await window.electronAPI.saveFile(markdownContent, currentPane.filePath)
      if (savedFilePath) {
        currentPane.filePath = savedFilePath
        currentPane.label = extractFileName(savedFilePath) || currentPane.label
      }
    }
  }

  const handleFileOpen = (_e: Electron.IpcRendererEvent, filePath: string, data: string): void => {
    const htmlContent = markdownToHtml(data)
    addTab(filePath, htmlContent)
  }

  useEffect(() => {
    // Electron APIリスナーの設定
    window.electronAPI.onSaveRequest(saveMemo)
    window.electronAPI.onNewTabRequested(() => addTab())
    window.electronAPI.onFileOpen(handleFileOpen)

    // クリーンアップ
    return (): void => {
      console.log('cleanup')
      window.electronAPI.removeSaveRequestListener(saveMemo)
      window.electronAPI.removeNewTabRequestListener(() => addTab())
      window.electronAPI.removeFileOpenListener(handleFileOpen)
    }
  }, [saveMemo])

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
