import React, { forwardRef, useCallback, useState, useRef } from 'react'
import { TabPaneProps } from './TabPane'
import { __DEV__ } from '@hi-ui/env'
import { TabItem } from './TabItem'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { TabInk } from './TabInk'
import { PlusOutlined, LeftOutlined, RightOutlined, UpOutlined, DownOutlined } from '@hi-ui/icons'
import { isUndef } from '@hi-ui/type-assertion'
import { IconButton } from '@hi-ui/icon-button'
import { HiBaseHTMLProps } from '@hi-ui/core'

const _role = 'tabs'
const _prefix = getPrefixCls(_role)

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
      prefixCls = _prefix,
      direction = 'horizontal',
      editable,
      onAdd,
      onDelete,
      draggable,
      onDragStart,
      onDragOver,
      onDrop,
      onDragEnd,
      type = 'line',
      extra,
      ...rest
    },
    ref
  ) => {
    const [activeTabId, setActiveTabId] = useUncontrolledState(
      () => {
        if (isUndef(defaultActiveId)) {
          return data[0] ? data[0].tabId : ''
        }

        return defaultActiveId
      },
      activeId,
      onChange
    )

    const [innerRef, setInnerRef] = useState<HTMLDivElement | null>(null)
    const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null)
    const [translateX, setTranslateX] = useState<number>(0)
    const [translateY, setTranslateY] = useState<number>(0)
    const itemsRef = useRef<Record<string, HTMLDivElement | null>>({})

    let showScrollBtn = false
    if (scrollRef && innerRef) {
      showScrollBtn =
        direction === 'horizontal'
          ? scrollRef.clientWidth > innerRef.clientWidth
          : scrollRef.clientHeight > innerRef.clientHeight
    }

    const onClickTab = useCallback(
      (key: React.ReactText, event: React.MouseEvent) => {
        if (onTabClick) {
          onTabClick(key, event)
        }
        if (key !== activeTabId && setActiveTabId) {
          setActiveTabId(key)
        }
      },
      [activeTabId, onTabClick, setActiveTabId]
    )
    return (
      <div
        style={style}
        className={cx(`${prefixCls}__list`, { [`${prefixCls}__list--${type}`]: type }, className)}
        ref={ref}
        {...rest}
      >
        {showScrollBtn && direction === 'horizontal' && (
          <IconButton
            className={`${prefixCls}__left-btn`}
            effect
            icon={<LeftOutlined />}
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
          />
        )}
        {showScrollBtn && direction === 'vertical' && (
          <IconButton
            className={`${prefixCls}__up-btn`}
            effect
            icon={<UpOutlined />}
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
          />
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
                type={type}
                itemRef={itemsRef.current[`${d.tabId}`]}
                index={index}
                active={activeTabId === d.tabId}
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
            {type === 'line' && (
              <TabInk
                translate={direction === 'horizontal' ? translateX : translateY}
                prefixCls={prefixCls}
                direction={direction}
                tabListRef={innerRef as HTMLDivElement}
                itemRef={itemsRef.current?.[activeTabId] as HTMLDivElement}
              />
            )}
          </div>
        </div>
        {showScrollBtn && direction === 'horizontal' && (
          <IconButton
            effect
            className={`${prefixCls}__right-btn`}
            icon={<RightOutlined />}
            onClick={() => {
              if (scrollRef && innerRef) {
                const scrollWidth = scrollRef.clientWidth
                const innerWidth = innerRef.clientWidth

                const canScrollWidth = scrollWidth - innerWidth + translateX
                const moveWidth = canScrollWidth < innerWidth ? canScrollWidth : innerWidth

                setTranslateX((prev) => prev - moveWidth)
              }
            }}
          />
        )}
        {showScrollBtn && direction === 'vertical' && (
          <IconButton
            effect
            className={`${prefixCls}__down-btn`}
            icon={<DownOutlined />}
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
          />
        )}
        {editable ? (
          <IconButton icon={<PlusOutlined />} className={`${prefixCls}__add-btn`} onClick={onAdd} />
        ) : null}
        {extra}
      </div>
    )
  }
)

export interface TabListProps
  extends Omit<HiBaseHTMLProps<'div'>, 'onDragEnd' | 'onDragOver' | 'onDragStart' | 'onDrop'> {
  /**
   * tabs 面板数据
   */
  data: TabPaneProps[]
  /**
   * 是否可编辑
   */
  direction?: 'horizontal' | 'vertical'
  /**
   * `activeId` 改变的回调
   */
  onChange?: (tabId: React.ReactText) => void
  /**
   * 标签点击触发回调
   */
  onTabClick?: (tabId: React.ReactText, event: React.MouseEvent) => void
  /**
   * 默认高亮id
   */
  defaultActiveId?: React.ReactText
  /**
   * 高亮id
   */
  activeId?: React.ReactText
  /**
   * 是否可编辑
   */
  editable?: boolean
  /**
   * 是否可拖拽
   */
  draggable?: boolean
  /**
   * 布局类型
   */
  type?: 'desc' | 'card' | 'button' | 'line'
  /**
   * 右侧的拓展区域
   */
  extra?: React.ReactNode
  /**
   * 节点增加时触发
   */
  onAdd?: () => void
  /**
   * 节点删除时时触发
   */
  onDelete?: (deletedNode: TabPaneProps, index: number) => void
  /**
   * 节点开始拖拽时触发
   */
  onDragStart?: (
    e: React.DragEvent<HTMLDivElement>,
    { dragNode }: { dragNode: TabPaneProps }
  ) => void
  /**
   * 节点拖拽移动时触发
   */
  onDragOver?: (
    e: React.DragEvent<HTMLDivElement>,
    { targetNode }: { targetNode: TabPaneProps }
  ) => void
  /**
   * 节点拖拽放下时触发
   */
  onDrop?: (
    e: React.DragEvent<HTMLDivElement>,
    {
      dragNode,
      targetNode,
      direction,
    }: { dragNode: TabPaneProps; targetNode: TabPaneProps; direction: 'prev' | 'next' | null }
  ) => void
  /**
   * 节点拖拽成功时触发
   */
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>, { dragNode }: { dragNode: TabPaneProps }) => void
}

if (__DEV__) {
  TabList.displayName = 'TabList'
}
