import React, { forwardRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { LeftOutlined } from '@hi-ui/icons'
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
      onClick,
      placement = 'vertical',
      showCollapse,
      expandedType = 'default',
      showAllSubMenus = false,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className, `${prefixCls}--${placement}`)

    const onToggle = useCallback(() => {}, [])

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <MenuContext.Provider value={{ placement, expandedType, showAllSubMenus }}>
          <ul className={cx(`${prefixCls}__wrapper`)}>
            {data.map((d) => (
              <MenuItem {...d} key={d.id} level={1} />
            ))}
          </ul>
          {placement === 'vertical' && showCollapse && (
            <div className={cx(`${prefixCls}__toggle`)} onClick={onToggle}>
              <LeftOutlined />
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
  onClick?: (activeId: string | number, prevActiveId: string | number) => void
  onClickSubMenu?: (subMenuIndexs: number) => void
  onCollapse?: (collapsed: boolean) => void
  overlayClassName?: string
  expandedType: 'default' | 'pop'
}

if (__DEV__) {
  Menu.displayName = 'Menu'
}
