import React, { forwardRef, useState, useRef, useCallback, useEffect } from 'react'
import { TabPaneProps } from './TabPane'
import { __DEV__ } from '@hi-ui/env'
import { TabItem } from './TabItem'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { TabInk } from './TabInk'
import { PlusOutlined, LeftOutlined, RightOutlined, UpOutlined, DownOutlined } from '@hi-ui/icons'
import { isArrayNonEmpty, isUndef } from '@hi-ui/type-assertion'
import { IconButton } from '@hi-ui/icon-button'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useResizeObserver } from './hooks'
import { useLatestCallback } from '@hi-ui/use-latest'
import { getNextTabId } from './utils'

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
      // @ts-ignore deprecated
      direction: directionProp,
      placement = 'horizontal',
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
    const direction = placement ?? directionProp ?? 'horizontal'

    const [activeTabId, setActiveTabId] = useUncontrolledState(
      () => {
        if (isUndef(defaultActiveId)) {
          return data[0] ? data[0].tabId : ''
        }

        return defaultActiveId
      },
      activeId,
      onChange,
      Object.is
    )

    const [innerElement, setInnerElement] = useState<HTMLDivElement | null>(null)
    const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(null)

    const showHorizontal = direction === 'horizontal'

    const getClientSize = useCallback(
      (element: HTMLElement) => (showHorizontal ? element.clientWidth : element.clientHeight),
      [showHorizontal]
    )

    const [translatePos, setTranslatePos] = useState<number>(0)
    const [translateBoundPos, setTranslateBoundPos] = useState<number>(0)

    const itemsRef = useRef<Record<string, HTMLDivElement | null>>({})

    const [showScrollBtn, setShowScrollBtn] = useState(false)

    const resizeScroll = (scrollSize: number, innerSize: number) => {
      const showScrollBtn = scrollSize > innerSize
      setShowScrollBtn(showScrollBtn)
      if (showScrollBtn) {
        setTranslateBoundPos(scrollSize - innerSize)
      }
    }

    // 响应式滚动按钮展示
    useResizeObserver({
      element: innerElement,
      getSize: getClientSize,
      onResize: (_, innerSize) => {
        if (scrollElement) {
          const scrollSize = getClientSize(scrollElement)
          resizeScroll(scrollSize, innerSize)
        }
      },
    })

    useResizeObserver({
      element: scrollElement,
      getSize: getClientSize,
      onResize: (_, scrollSize) => {
        if (innerElement) {
          const innerSize = getClientSize(innerElement)
          resizeScroll(scrollSize, innerSize)
          // 每次滚动容器大小改变后，需要同步更新滚动位置
          initScrollPosition(activeId)
        }
      },
    })

    const getTabPos = useCallback(
      (tabId: React.ReactText) => {
        let target = 0

        // 获取目标元素的位置
        const targetElement = itemsRef.current[tabId]
        if (targetElement) {
          const rect = targetElement!.getBoundingClientRect()
          target = showHorizontal ? rect.left : rect.top
        }
        return target
      },
      [showHorizontal]
    )

    const getTabOffset = useCallback(
      (tabId: React.ReactText) => {
        // 获取目标元素的位置
        const targetPos = getTabPos(tabId)

        // 获取基准元素的位置（第一个）
        let basePos = 0
        if (isArrayNonEmpty(data)) {
          const baseItem = data[0]
          basePos = getTabPos(baseItem.tabId)
        }

        // 返回目标元素相对基准元素的偏移量
        return targetPos ? targetPos - basePos : 0
      },
      [data, getTabPos]
    )

    const syncScrollPosition = useCallback(
      (tabId: React.ReactText) => {
        if (!innerElement) return
        if (!scrollElement) return

        const scrollSize = getClientSize(scrollElement)
        const innerSize = getClientSize(innerElement)
        const offsetValue = getTabOffset(tabId)

        // 左边或上半部内容展示不全
        const currentOffset = -translatePos
        if (offsetValue < currentOffset) {
          setTranslatePos(-offsetValue)
        } else {
          // 右边或下半部内容展示不全
          const nextTabId = getNextTabId(data, tabId)
          const nextOffsetValue = nextTabId !== null ? getTabOffset(nextTabId) : scrollSize
          const currentOffset = -translatePos + innerSize

          if (nextOffsetValue > currentOffset) {
            setTranslatePos(translatePos - (nextOffsetValue - currentOffset))
          }
        }
      },
      [data, getClientSize, getTabOffset, innerElement, scrollElement, translatePos]
    )

    const initScrollPosition = useLatestCallback((tabId?: React.ReactText) => {
      tabId && syncScrollPosition(tabId)
    })

    const onClickTab = useLatestCallback((tabId: React.ReactText, event: React.MouseEvent) => {
      onTabClick?.(tabId, event)
      setActiveTabId(tabId)
      syncScrollPosition(tabId)
    })

    useEffect(() => {
      // activeId 受控模式下改变后，同步更新滚动位置
      initScrollPosition(activeId)
    }, [activeId, initScrollPosition])

    return (
      <div
        style={style}
        className={cx(
          `${prefixCls}__list`,
          `${prefixCls}__list--placement-${direction}`,
          { [`${prefixCls}__list--${type}`]: type },
          className
        )}
        ref={ref}
        {...rest}
      >
        {showScrollBtn ? (
          <IconButton
            className={showHorizontal ? `${prefixCls}__left-btn` : `${prefixCls}__up-btn`}
            effect
            disabled={translatePos === 0}
            icon={showHorizontal ? <LeftOutlined /> : <UpOutlined />}
            onClick={() => {
              if (!scrollElement) return
              if (!innerElement) return
              // 向前面滚动
              const clientSize = getClientSize(innerElement)
              const canScroll = -translatePos - clientSize
              const moveWidth = canScroll >= 0 ? clientSize : -translatePos

              setTranslatePos((prev) => prev + moveWidth)
            }}
          />
        ) : null}

        <div className={cx(`${prefixCls}__list--inner`)} ref={setInnerElement}>
          <div
            className={cx(`${prefixCls}__list--scroll`)}
            ref={setScrollElement}
            style={
              showScrollBtn
                ? {
                    transform:
                      direction === 'horizontal'
                        ? `translateX(${translatePos}px)`
                        : `translateY(${translatePos}px)`,
                  }
                : undefined
            }
          >
            {data.map((item, index) => (
              <TabItem
                key={index}
                {...item}
                ref={(node) => {
                  itemsRef.current[`${item.tabId}`] = node
                }}
                type={type}
                itemRef={itemsRef.current[`${item.tabId}`]}
                index={index}
                active={activeTabId === item.tabId}
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
            {type === 'line' ? (
              <TabInk
                prefixCls={prefixCls}
                showHorizontal={showHorizontal}
                activeItemElement={itemsRef.current[activeTabId]}
                activeTabId={activeTabId}
                getTabOffset={getTabOffset}
              />
            ) : null}
          </div>
        </div>
        {showScrollBtn ? (
          <IconButton
            effect
            className={showHorizontal ? `${prefixCls}__right-btn` : `${prefixCls}__down-btn`}
            disabled={translateBoundPos === -translatePos}
            icon={showHorizontal ? <RightOutlined /> : <DownOutlined />}
            onClick={() => {
              if (!scrollElement) return
              if (!innerElement) return
              // 向后面滚动
              const scrollSize = getClientSize(scrollElement)
              const innerSize = getClientSize(innerElement)
              const canScrollWidth = scrollSize - innerSize + translatePos
              const moveWidth = canScrollWidth < innerSize ? canScrollWidth : innerSize

              setTranslatePos((prev) => prev - moveWidth)
            }}
          />
        ) : null}
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
   * 展示布局方向
   */
  placement?: 'horizontal' | 'vertical'
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
