import React, { forwardRef, useCallback, useState, useEffect, useMemo, useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { RightOutlined } from '@hi-ui/icons'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { isFunction } from '@hi-ui/type-assertion'
import { MenuDataItem } from './types'
import { getAncestorIds } from './util'
import { Menu } from './Menu'

const SIDEBAR_PREFIX = getPrefixCls('sidebar')

const NOOP_ARRAY = [] as []

/**
 * 侧边栏菜单
 */
export const Sidebar = forwardRef<HTMLDivElement | null, SidebarProps>(
  (
    {
      prefixCls = SIDEBAR_PREFIX,
      role = 'sidebar',
      className,
      data = NOOP_ARRAY,
      showCollapse = true,
      defaultExpandAll = false,
      onExpand,
      defaultActiveId = '',
      activeId: activeIdProp,
      collapsed,
      defaultCollapsed = false,
      onCollapse,
      render,
      extraHeader,
      onClick,
      showMenuArrow = false,
      menuWidth = 180,
    },
    ref
  ) => {
    const [activeId, updateActiveId] = useUncontrolledState(defaultActiveId, activeIdProp, onClick)
    const [activeParents, updateActiveParents] = useState(() => getAncestorIds(activeId, data))
    // 用于更新Menu组件
    const [menuKey, setMenuKey] = useState<number>(0)
    const wrapperRef = useRef<HTMLDivElement>(null)

    const sidebarActiveId = useMemo(() => {
      return activeParents[activeParents.length - 1] ?? activeId
    }, [activeParents])

    const [showMenu, menuToggleAction] = useUncontrolledToggle({
      defaultVisible: defaultCollapsed,
      visible: collapsed,
      onToggle: onCollapse,
    })

    useEffect(() => {
      const newActiveParents = getAncestorIds(activeId, data) ?? ''
      updateActiveParents(newActiveParents)
    }, [activeId, data, updateActiveId])

    const menuDataMemo = useMemo(() => {
      const menuData = data.find((item) => item.id === sidebarActiveId)?.children ?? []
      if (menuData.length > 0) {
        menuToggleAction.on()
      } else {
        menuToggleAction.off()
      }
      return menuData
    }, [sidebarActiveId, data, menuToggleAction])

    useEffect(() => {
      // 每次菜单数据变化时重新渲染下菜单，否则defaultExpandAll不生效
      setMenuKey(menuKey + 1)
    }, [menuDataMemo])

    const clickSidebar = useCallback(
      (id: React.ReactText, raw: MenuDataItem) => {
        if (sidebarActiveId === id) {
          return
        }
        updateActiveId(id, raw)
      },
      [sidebarActiveId, updateActiveId]
    )

    const clickMenu = useCallback(
      (id: React.ReactText, raw: MenuDataItem) => {
        updateActiveId(id, raw)
      },
      [updateActiveId]
    )

    const cls = cx(
      `${prefixCls}-wrapper`,
      showMenu && `${prefixCls}-wrapper--showMenu`,
      showMenuArrow && `${prefixCls}-wrapper--showMenuArrow`
    )

    return (
      <div className={cls} ref={wrapperRef}>
        <div className={cx(`${prefixCls}`, className)} ref={ref} role={role}>
          <ul className={`${prefixCls}-list`}>
            {data.map((item) => {
              return (
                <SidebarItem
                  {...item}
                  className={item.id === sidebarActiveId ? `${prefixCls}-item--active` : ''}
                  render={() => render?.(item, 0)}
                  key={item.id}
                  onClick={() => clickSidebar(item.id, item)}
                />
              )
            })}
          </ul>
        </div>
        <div
          className={cx(`${prefixCls}-menu-wrapper`)}
          style={{ width: showMenu ? menuWidth : undefined }}
        >
          <Menu
            key={menuKey}
            activeId={activeId}
            data={menuDataMemo}
            defaultExpandAll
            onClick={clickMenu}
            style={{ width: menuWidth }}
            extraHeader={extraHeader}
            render={render}
          />
        </div>
        {menuDataMemo.length > 0 && showCollapse && (
          <div className={`${prefixCls}-toggle`} onClick={menuToggleAction.not}>
            <RightOutlined />
          </div>
        )}
      </div>
    )
  }
)

export interface SidebarProps extends Omit<HiBaseHTMLProps<'div'>, 'onClick'> {
  /**
   * 菜单项数据列表
   */
  data: MenuDataItem[]
  /**
   * 默认激活的菜单项 id
   */
  defaultActiveId?: React.ReactText
  /**
   * 激活的菜单项 id
   */
  activeId?: React.ReactText
  /**
   * 是否显示收缩开关，菜单垂直展示时有效
   */
  showCollapse?: boolean
  /**
   * 首次渲染默认展开所有菜单项，为非受控模式
   */
  defaultExpandAll?: boolean
  /**
   * 默认是否收起子菜单，菜单垂直展示时有效
   */
  defaultCollapsed?: boolean
  /**
   * 是否收起子菜单，菜单垂直展示时有效
   */
  collapsed?: boolean
  /**
   * 展开菜单时回调
   */
  onExpand?: (expandedIds: React.ReactText[]) => void
  /**
   * 点击菜单选项时的回调
   */
  onClick?: (menuId: React.ReactText, menuItem: MenuDataItem) => void
  /**
   * 点击收缩开关时的回调
   */
  onCollapse?: (collapsed: boolean) => void
  /**
   * 自定义渲染菜单项
   */
  render?: (menuItem: MenuDataItem, level?: number) => React.ReactNode
  /**
   * 额外的头部内容
   */
  extraHeader?: React.ReactNode
  /**
   * 是否显示菜单箭头
   * @default false
   */
  showMenuArrow?: boolean
  /**
   * 设置菜单宽度
   */
  menuWidth?: number | string
}

if (__DEV__) {
  Sidebar.displayName = 'Sidebar'
}

const SIDEBAR_ITEM_PREFIX = getPrefixCls('sidebar-item')

const SidebarItem = (data: SidebarItemProps) => {
  const { title, icon, render, level, className, onClick } = data
  const prefixCls = SIDEBAR_ITEM_PREFIX
  const cls = cx(prefixCls, className)

  const renderTitle = useCallback(
    (data) => {
      return isFunction(render) ? render(data, level) : title
    },
    [level, render, title]
  )

  return (
    <li className={cls} onClick={onClick}>
      {icon && <div className={`${prefixCls}__icon`}>{icon}</div>}
      <div className={`${prefixCls}__title`}>
        <span>{renderTitle(data)}</span>
      </div>
    </li>
  )
}

interface SidebarItemProps extends Omit<HiBaseHTMLProps<'li'>, 'id'> {
  id: React.ReactText
  title: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
  level?: number
  render?: (node: MenuDataItem, level?: number) => React.ReactNode
}
