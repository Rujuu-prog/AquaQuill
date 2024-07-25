import { useState } from 'react'
import TabsContainer from '../tab/TabsContainer'
import { v4 as uuidv4 } from 'uuid'

interface Tab {
  value: string
  label: string
  content: string
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

  const addTab = (): void => {
    const newTab = createNewTab()
    setTabs((currentTabs) => [...currentTabs, newTab])
    setActiveTab(newTab.value)
  }

  const updateTabContent = (tabValue: string, content: string): void => {
    setTabs((currentTabs) =>
      currentTabs.map((tab) => (tab.value === tabValue ? { ...tab, content } : tab))
    )
  }

  return (
    <TabsContainer
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      removeTab={removeTab}
      addTab={addTab}
      updateTabContent={updateTabContent}
    />
  )
}
