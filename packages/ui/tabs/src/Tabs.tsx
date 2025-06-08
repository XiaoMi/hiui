import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TabPaneProps } from './TabPane'
import { TabList } from './TabList'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { isUndef } from '@hi-ui/type-assertion'
import { HiBaseHTMLProps } from '@hi-ui/core'

const _role = 'tabs'
const _prefix = getPrefixCls(_role)

/**
 * Tabs 标签页
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
      placement = 'horizontal',
      onEdit,
      onAdd,
      onAdded,
      onDelete,
      draggable = false,
      onDragStart,
      onDragOver,
      onDragEnd,
      onDrop,
      style,
      type = 'line',
      size = 'md',
      showDivider,
      maxTabTitleWidth,
      extra,
      ...rest
    },
    ref
  ) => {
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

    const [activeTabId, setActiveTabId] = useUncontrolledState(
      () => {
        if (isUndef(defaultActiveId)) {
          return tabList[0] ? tabList[0].tabId : ''
        }

        return defaultActiveId
      },
      activeId,
      onChange
    )

    const cls = cx(
      prefixCls,
      className,
      placement && `${prefixCls}--placement-${placement}`,
      type && `${prefixCls}--type-${type}`
    )

    return (
      <div ref={ref} role={role} className={cls} style={style} {...rest}>
        <TabList
          prefixCls={prefixCls}
          data={tabList}
          activeId={activeTabId}
          onChange={setActiveTabId}
          onTabClick={onTabClick}
          placement={placement}
          editable={editable}
          onEdit={onEdit}
          onAdd={onAdd}
          onAdded={onAdded}
          onDelete={onDelete}
          draggable={draggable}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDrop={onDrop}
          type={type}
          size={size}
          showDivider={showDivider}
          onDragStart={onDragStart}
          extra={extra}
          maxTabTitleWidth={maxTabTitleWidth}
        />
        <div className={`${_prefix}__content`}>
          {React.Children.map(children, (child) => {
            return child
              ? React.cloneElement(child, {
                  key: child.props.tabId,
                  className: cx(`${_prefix}-tab-pane`, child.props.className),
                  active: activeTabId === child.props.tabId,
                })
              : null
          })}
        </div>
      </div>
    )
  }
)

export interface TabsProps
  extends Omit<HiBaseHTMLProps<'div'>, 'onDragEnd' | 'onDragOver' | 'onDragStart' | 'onDrop'> {
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
  defaultActiveId?: React.ReactText
  /**
   * 高亮id
   */
  activeId?: React.ReactText

  /**
   * 布局方向
   */
  placement?: 'horizontal' | 'vertical'
  /**
   * 布局类型
   */
  type?: 'desc' | 'card' | 'button' | 'line'
  /**
   * 大小
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 是否显示下划线
   */
  showDivider?: boolean
  /**
   * 标签最大宽度
   */
  maxTabTitleWidth?: number
  /**
   * `activeId` 改变的回调
   */
  onChange?: (tabId: React.ReactText) => void
  /**
   * 标签点击触发回调
   */
  onTabClick?: (tabId: React.ReactText) => void
  /**
   * 右侧的拓展区域
   */
  extra?: React.ReactNode
  /**
   * 节点编辑时触发
   */
  onEdit?: (value: string, item: TabPaneProps) => boolean | Promise<boolean>
  /**
   * 节点增加时触发
   */
  onAdd?: () => void
  /**
   * 节点增加完成时触发
   */
  onAdded?: (newTab: TabPaneProps) => boolean | Promise<boolean>
  /**
   * 节点删除时时触发
   */
  onDelete?: (deletedNode: TabPaneProps, evt: React.MouseEvent) => boolean | Promise<boolean>
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
  Tabs.displayName = 'Tabs'
}
