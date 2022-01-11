import React, { forwardRef, useCallback, useState, useEffect } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@hi-ui/icons'
import { __DEV__ } from '@hi-ui/env'
import { MenuItem } from './MenuItem'
import MenuContext from './context'
import { getAncestorIds } from './util'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'

const MENU_PREFIX = getPrefixCls('menu')

/**
 * TODO: What is Menu
 */
export const Menu = forwardRef<HTMLDivElement | null, MenuProps>(
  (
    {
      prefixCls = MENU_PREFIX,
      role = 'menu',
      className,
      data,
      placement = 'vertical',
      showCollapse,
      expandedType = 'default',
      showAllSubMenus = false,
      defaultExpandedIds,
      defaultActiveId,
      activeId,
      onClickSubMenu,
      onClick,
      ...rest
    },
    ref
  ) => {
    const [_activeId, updateActiveId] = useUncontrolledState(
      defaultActiveId || '',
      activeId,
      onClick
    )

    const [activeParents, updateActiveParents] = useState(getAncestorIds(_activeId, data))
    useEffect(() => {
      updateActiveParents(getAncestorIds(_activeId, data))
    }, [_activeId, data])
    const [_expandedIds, updateExpanedIds] = useState(defaultExpandedIds || [])

    const clickMenu = useCallback(
      (id: React.ReactText) => {
        updateActiveId(id)
      },
      [updateActiveId]
    )
    const clickSubMenu = useCallback(
      (id: React.ReactText) => {
        updateExpanedIds(
          _expandedIds.includes(id)
            ? _expandedIds.filter((expandedid) => expandedid !== id)
            : _expandedIds.concat(id)
        )
        if (onClickSubMenu) {
          onClickSubMenu(id)
        }
      },
      [onClickSubMenu, _expandedIds]
    )

    const closePopper = useCallback(
      (id: React.ReactText) => {
        updateExpanedIds(_expandedIds.filter((expandedid) => expandedid !== id))
      },
      [_expandedIds]
    )

    const closeAllPopper = useCallback(() => {
      updateExpanedIds([])
    }, [])

    const [mini, setMini] = useState(false)
    const cls = cx(prefixCls, className, `${prefixCls}--${placement}`, {
      [`${prefixCls}--mini`]: mini,
    })

    const onToggle = useCallback(() => {
      setMini(!mini)
      closeAllPopper()
    }, [mini, closeAllPopper])

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <MenuContext.Provider
          value={{
            placement,
            expandedType,
            showAllSubMenus,
            mini,
            clickMenu,
            clickSubMenu,
            closePopper,
            closeAllPopper,
            activeParents,
            activeId: _activeId,
            expandedIds: _expandedIds,
          }}
        >
          <ul className={cx(`${prefixCls}__wrapper`)}>
            {data.map((d) => (
              <MenuItem {...d} key={d.id} level={1} />
            ))}
          </ul>
          {placement === 'vertical' && showCollapse && (
            <div className={cx(`${prefixCls}__toggle`)} onClick={onToggle}>
              {mini ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
          )}
        </MenuContext.Provider>
      </div>
    )
  }
)
export type MenuItemProps = {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  content: React.ReactNode
  icon?: React.ReactNode
  id: React.ReactText
  disabled?: boolean
  children?: MenuItemProps[]
  level?: number
  parentIds?: React.ReactText[]
}
export interface MenuProps {
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
  data: MenuItemProps[]
  activeId?: React.ReactText
  placement?: 'horizontal' | 'vertical'
  collapsed?: boolean
  showCollapse?: boolean
  showAllSubMenus?: boolean
  accordion?: boolean
  style?: React.CSSProperties
  onClick?: (menuId: React.ReactText) => void
  onClickSubMenu?: (subMenuId: React.ReactText) => void
  onCollapse?: (collapsed: boolean) => void
  overlayClassName?: string
  expandedType?: 'default' | 'pop'
  defaultExpandedIds?: React.ReactText[]
  defaultActiveId?: React.ReactText
}

if (__DEV__) {
  Menu.displayName = 'Menu'
}
