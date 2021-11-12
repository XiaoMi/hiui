import React, { forwardRef, useCallback } from 'react'
import { TabPaneProps } from './TabPane'
import { __DEV__ } from '@hi-ui/env'
import TabItem from './TabItem'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'

export const TabList = forwardRef<HTMLDivElement | null, TabListProps>(
  ({ data, className, style, activeId, defaultActiveId, onChange, onTabClick }, ref) => {
    const [activeTab, setActiveTab] = useUncontrolledState(
      defaultActiveId || data[0]?.tabId,
      activeId,
      onChange
    )

    const onClickTab = useCallback(
      (key: string) => {
        if (onTabClick) {
          onTabClick(key)
        }
        if (key !== activeTab && setActiveTab) {
          setActiveTab(key)
        }
      },
      [activeTab, onTabClick, setActiveTab]
    )

    return (
      <div style={style} className={className} ref={ref}>
        {data.map((d, index) => (
          <TabItem key={index} {...d} active={activeTab === d.tabId} onTabClick={onClickTab} />
        ))}
      </div>
    )
  }
)

export interface TabListProps {
  style?: React.CSSProperties
  className?: string
  data: TabPaneProps[]
  onChange?: (tabId: string) => void
  onTabClick?: (tabId: string) => void
  /**
   * 默认高亮id
   */
  defaultActiveId?: string
  /**
   * 高亮id
   */
  activeId?: string
}

if (__DEV__) {
  TabList.displayName = 'TabList'
}
