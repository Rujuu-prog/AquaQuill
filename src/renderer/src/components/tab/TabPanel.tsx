import { Tabs } from '@mantine/core'
import Editor from '../editor/Editor'

interface TabPanelProps {
  tabs: { value: string; label: string; content: string }[]
  updateTabContent: (tabValue: string, content: string) => void
}

export default function TabPanel({ tabs, updateTabContent }: TabPanelProps): JSX.Element {
  return (
    <div style={{ overflow: 'auto', height: 'calc(100vh - 48px)' }}>
      {tabs.map((tab) => (
        <Tabs.Panel key={tab.value} value={tab.value} h={'100%'}>
          <Editor tab={tab} updateTabContent={updateTabContent} />
        </Tabs.Panel>
      ))}
    </div>
  )
}
