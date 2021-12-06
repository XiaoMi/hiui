import React, { forwardRef, useCallback, useState, useRef } from 'react'
import { TabPaneProps } from './TabPane'
import { __DEV__ } from '@hi-ui/env'
import { TabItem } from './TabItem'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { cx } from '@hi-ui/classname'
import { TabInk } from './TabInk'

export const TabList = forwardRef<HTMLDivElement | null, TabListProps>(
  (
    {
      data,
      className,
      style,
      activeId,
      defaultActiveId,
      onChange,
      onTabClick,
      prefixCls,
      direction = 'horizontal',
    },
    ref
  ) => {
    const [activeTab, setActiveTab] = useUncontrolledState(
      defaultActiveId || data[0]?.tabId,
      activeId,
      onChange
    )

    const [innerRef, setInnerRef] = useState<HTMLDivElement | null>(null)
    const itemsRef = useRef<Record<string, HTMLElement | null>>({})

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
      <div style={style} className={cx(`${prefixCls}__list`, className)} ref={ref}>
        <div className={cx(`${prefixCls}__list--inner`)} ref={setInnerRef}>
          {data.map((d, index) => (
            <TabItem
              key={index}
              {...d}
              ref={(node) => {
                itemsRef.current[`${d.tabId}`] = node
              }}
              active={activeTab === d.tabId}
              prefixCls={prefixCls}
              onTabClick={onClickTab}
            />
          ))}
          <TabInk
            prefixCls={prefixCls}
            direction={direction}
            tabListRef={innerRef as HTMLDivElement}
            itemRef={itemsRef.current?.[activeTab] as HTMLElement}
          />
        </div>
      </div>
    )
  }
)

export interface TabListProps {
  style?: React.CSSProperties
  className?: string
  prefixCls?: string
  data: TabPaneProps[]
  direction: 'horizontal' | 'vertical'
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
