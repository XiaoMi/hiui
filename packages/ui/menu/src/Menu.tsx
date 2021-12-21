import React, { forwardRef, useCallback, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { LeftOutlined, RightOutlined } from '@hi-ui/icons'
import { __DEV__ } from '@hi-ui/env'
import { MenuItem } from './MenuItem'
import MenuContext from './context'

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
      defaultSelectedIds,
      onClickSubMenu,
      onClick,
      ...rest
    },
    ref
  ) => {
    const [_selectedIds, updateSelectedIds] = useState(defaultSelectedIds || [])
    const [_expandedIds, updateExpanedIds] = useState(defaultExpandedIds || [])
    const clickMenu = useCallback(
      (id: React.ReactText) => {
        updateSelectedIds(_selectedIds.concat(id))
        if (onClick) {
          onClick(id)
        }
      },
      [onClick, _selectedIds]
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

    const [mini, setMini] = useState(false)
    const cls = cx(prefixCls, className, `${prefixCls}--${placement}`, {
      [`${prefixCls}--mini`]: mini,
    })

    const onToggle = useCallback(() => {
      setMini(!mini)
    }, [mini])

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
            selectedIds: _selectedIds,
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
              {mini ? <RightOutlined /> : <LeftOutlined />}
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
  id: string | number
  disabled?: boolean
  children?: MenuItemProps[]
  level: number
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
  activeId?: string | number
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
  expandedType: 'default' | 'pop'
  defaultExpandedIds: React.ReactText[]
  defaultSelectedIds: React.ReactText[]
}

if (__DEV__) {
  Menu.displayName = 'Menu'
}
