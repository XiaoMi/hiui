import React, { forwardRef, useMemo, useState, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TabPaneProps } from './TabPane'
import { TabList } from './TabList'

const _role = 'tabs'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Tabs
 */
export const Tabs = forwardRef<HTMLDivElement | null, TabsProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      defaultActiveId,
      activeId,
      onChange,
      onTabClick,
      editable,
      direction = 'horizontal',
      onAdd,
      onDelete,
      draggable = false,
      onDragStart,
      onDragOver,
      onDragEnd,
      onDrop,
      style,
      ...rest
    },
    ref
  ) => {
    console.log(999, style)
    const cls = cx(prefixCls, className, { [`${prefixCls}--vertical`]: direction === 'vertical' })

    const tabList = useMemo(() => {
      const list: TabPaneProps[] = []
      React.Children.map(children, (child) => {
        if (child) {
          const { tabTitle, tabId, tabDesc, closeable, disabled } = child.props
          const item = { tabTitle, tabId, tabDesc, closeable, disabled }

          list.push(item)
        }
      })
      return list
    }, [children])

    const [activePane, setActivePane] = useState(activeId || defaultActiveId || tabList[0]?.tabId)

    const _onChange = useCallback<(tabId: string) => void>(
      (tabId) => {
        if (onChange) {
          onChange(tabId)
        }
        setActivePane(tabId)
      },
      [onChange]
    )

    return (
      <div ref={ref} role={role} className={cls} style={style} {...rest}>
        <TabList
          prefixCls={prefixCls}
          data={tabList}
          activeId={activeId}
          onChange={_onChange}
          onTabClick={onTabClick}
          direction={direction}
          editable={editable}
          onAdd={onAdd}
          onDelete={onDelete}
          draggable={draggable}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onDragStart={onDragStart}
        />
        <div className={`${_prefix}__content`}>
          {React.Children.map(children, (child) => {
            return (
              child &&
              React.cloneElement(child, {
                active: activePane === child.props.tabId,
              })
            )
          })}
        </div>
      </div>
    )
  }
)

export interface TabsProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 组件的注入样式
   */
  style?: React.CSSProperties
  /**
   * 是否可拖拽
   */
  draggable?: boolean
  /**
   * 是否可编辑
   */
  editable?: boolean
  /**
   * 内容
   */
  children?: React.ReactElement[]
  /**
   * 默认高亮id
   */
  defaultActiveId?: string
  /**
   * 高亮id
   */
  activeId?: string

  /**
   * 布局方向
   */
  direction?: 'horizontal' | 'vertical'
  /**
   * `activeId` 改变的回调
   */
  onChange?: (tabId: string) => void
  /**
   * 标签点击触发回调
   */
  onTabClick?: (tabId: string) => void

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
  Tabs.displayName = 'Tabs'
}
