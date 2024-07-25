import { Tabs, rem } from '@mantine/core'
import { IconX, IconPlus } from '@tabler/icons-react'

interface TabListProps {
  tabs: { value: string; label: string; content: string }[]
  activeTab: string | null
  removeTab: (tabValue: string) => void
  addTab: () => void
}

export default function TabList({ tabs, activeTab, removeTab, addTab }: TabListProps): JSX.Element {
  const iconStyle = { width: rem(12), height: rem(12) }

  return (
    <Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Tab
          key={tab.value}
          value={tab.value}
          rightSection={
            activeTab === tab.value ? (
              <IconX
                style={iconStyle}
                onClick={(e) => {
                  e.stopPropagation() // タブの切り替えを防止
                  removeTab(tab.value)
                }}
              />
            ) : null
          }
        >
          {tab.label}
        </Tabs.Tab>
      ))}
      <Tabs.Tab value="add-tab" onClick={addTab}>
        <IconPlus />
      </Tabs.Tab>
    </Tabs.List>
  )
}
