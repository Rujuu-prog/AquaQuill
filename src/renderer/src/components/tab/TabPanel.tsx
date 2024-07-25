import { Tabs } from '@mantine/core'
import Editor from '../editor/Editor'

interface TabPanelProps {
  tabs: { value: string; label: string; content: string }[]
  updateTabContent: (tabValue: string, content: string) => void
}

export default function TabPanel({ tabs, updateTabContent }: TabPanelProps): JSX.Element {
  return (
    <>
      {tabs.map((tab) => (
        <Tabs.Panel key={tab.value} value={tab.value}>
          <Editor tab={tab} updateTabContent={updateTabContent} />
        </Tabs.Panel>
      ))}
    </>
  )
}
