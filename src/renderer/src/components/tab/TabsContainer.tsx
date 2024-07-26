import { Tabs } from '@mantine/core'
import TabList from './TabList'
import TabPanel from './TabPanel'

interface TabsContainerProps {
  tabs: { value: string; label: string; content: string }[]
  activeTab: string | null
  setActiveTab: (value: string | null) => void
  removeTab: (tabValue: string) => void
  addTab: () => void
  updateTabContent: (tabValue: string, content: string) => void
}

export default function TabsContainer({
  tabs,
  activeTab,
  setActiveTab,
  removeTab,
  addTab,
  updateTabContent
}: TabsContainerProps): JSX.Element {
  return (
    <Tabs
      color="indigo"
      variant="outline"
      value={activeTab}
      onChange={(value) => setActiveTab(value)}
      h={"100vh"}
    >
      <TabList tabs={tabs} activeTab={activeTab} removeTab={removeTab} addTab={addTab} />
      <TabPanel tabs={tabs} updateTabContent={updateTabContent} />
    </Tabs>
  )
}
