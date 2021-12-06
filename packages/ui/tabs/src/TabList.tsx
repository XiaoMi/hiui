import React, { forwardRef, useCallback, useState, useRef, useMemo } from 'react'
import { TabPaneProps } from './TabPane'
import { __DEV__ } from '@hi-ui/env'
import { TabItem } from './TabItem'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { cx } from '@hi-ui/classname'
import { TabInk } from './TabInk'
import { PlusOutlined, LeftOutlined, RightOutlined, UpOutlined, DownOutlined } from '@hi-ui/icons'
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
      editable,
      onAdd,
      onDelete,
      draggable,
      onDragStart,
      onDragOver,
      onDrop,
      onDragEnd,
    },
    ref
  ) => {
    const [activeTab, setActiveTab] = useUncontrolledState(
      defaultActiveId || data[0]?.tabId,
      activeId,
      onChange
    )

    const [innerRef, setInnerRef] = useState<HTMLDivElement | null>(null)
    const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null)
    const [translateX, setTranslateX] = useState<number>(0)
    const [translateY, setTranslateY] = useState<number>(0)
    const itemsRef = useRef<Record<string, HTMLDivElement | null>>({})
    const showScrollBtn = useMemo(() => {
      if (scrollRef && innerRef) {
        return direction === 'horizontal'
          ? scrollRef?.clientWidth > innerRef?.clientWidth
          : scrollRef?.clientHeight > innerRef?.clientHeight
      }
    }, [scrollRef, innerRef, direction])

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
        {showScrollBtn && direction === 'horizontal' && (
          <div
            className={`${prefixCls}__add-btn`}
            onClick={() => {
              if (scrollRef && innerRef) {
                const canScroll = -translateX - innerRef.clientWidth
                let moveWidth = 0
                if (canScroll >= 0) {
                  moveWidth = innerRef.clientWidth
                } else {
                  moveWidth = -translateX
                }

                setTranslateX(translateX + moveWidth)
              }
            }}
          >
            <LeftOutlined />
          </div>
        )}
        {showScrollBtn && direction === 'vertical' && (
          <div
            className={`${prefixCls}__add-btn`}
            onClick={() => {
              if (scrollRef && innerRef) {
                const canScroll = -translateY - innerRef.clientHeight
                let moveWidth = 0
                if (canScroll >= 0) {
                  moveWidth = innerRef.clientHeight
                } else {
                  moveWidth = -translateY
                }

                setTranslateY(translateY + moveWidth)
              }
            }}
          >
            <UpOutlined />
          </div>
        )}
        <div className={cx(`${prefixCls}__list--inner`)} ref={setInnerRef}>
          <div
            className={cx(`${prefixCls}__list--scroll`)}
            ref={setScrollRef}
            style={
              showScrollBtn
                ? {
                    transform:
                      direction === 'horizontal'
                        ? `translateX(${translateX}px)`
                        : `translateY(${translateY}px)`,
                  }
                : {}
            }
          >
            {data.map((d, index) => (
              <TabItem
                key={index}
                {...d}
                ref={(node) => {
                  itemsRef.current[`${d.tabId}`] = node
                }}
                itemRef={itemsRef.current[`${d.tabId}`]}
                index={index}
                active={activeTab === d.tabId}
                prefixCls={prefixCls}
                draggable={draggable}
                onTabClick={onClickTab}
                editable={editable}
                onDelete={onDelete}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
                direction={direction}
              />
            ))}
            <TabInk
              prefixCls={prefixCls}
              direction={direction}
              tabListRef={innerRef as HTMLDivElement}
              itemRef={itemsRef.current?.[activeTab] as HTMLDivElement}
            />
          </div>
        </div>
        {showScrollBtn && direction === 'horizontal' && (
          <div
            className={`${prefixCls}__add-btn`}
            onClick={() => {
              if (scrollRef && innerRef) {
                const canScroll = scrollRef.clientWidth - innerRef.clientWidth + translateX
                let moveWidth = 0
                if (canScroll >= innerRef.clientWidth) {
                  moveWidth = innerRef.clientWidth
                } else {
                  moveWidth = canScroll
                }

                setTranslateX(translateX - moveWidth)
              }
            }}
          >
            <RightOutlined />
          </div>
        )}
        {showScrollBtn && direction === 'vertical' && (
          <div
            className={`${prefixCls}__add-btn`}
            onClick={() => {
              if (scrollRef && innerRef) {
                const canScroll = scrollRef.clientHeight - innerRef.clientHeight + translateY
                let moveWidth = 0
                if (canScroll >= innerRef.clientHeight) {
                  moveWidth = innerRef.clientHeight
                } else {
                  moveWidth = canScroll
                }

                setTranslateY(translateY - moveWidth)
              }
            }}
          >
            <DownOutlined />
          </div>
        )}
        {editable && (
          <div className={`${prefixCls}__add-btn`} onClick={onAdd}>
            <PlusOutlined />
          </div>
        )}
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
  editable?: boolean
  draggable?: boolean
  /**
   * 节点增加时触发
   */
  onAdd?: () => void
  /**
   * 节点删除时时触发
   */
  onDelete?: (deletedNode: TabPaneProps, index: number) => void
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop?: (
    e: React.DragEvent<HTMLDivElement>,
    {
      dragNode,
      dropNode,
      direction,
    }: { dragNode: TabPaneProps; dropNode: TabPaneProps; direction: string | null }
  ) => void
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void
}

if (__DEV__) {
  TabList.displayName = 'TabList'
}
