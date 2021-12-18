import React, { useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { MenuItemProps } from './Menu'
import { __DEV__ } from '@hi-ui/env'
import { DownOutlined } from '@hi-ui/icons'

const MENU_PREFIX = getPrefixCls('menu')

export const MenuItem: React.FC<MenuItemProps> = ({
  prefixCls = MENU_PREFIX,
  icon,
  content,
  disabled,
  id,
  children,
}) => {
  const itemRef = useRef<HTMLLIElement | null>(null)
  return (
    <li
      ref={itemRef}
      className={cx(`${prefixCls}-item`, { [`${prefixCls}-item--disabled`]: disabled })}
    >
      {icon}
      <span className={`${prefixCls}-item__content`}>{content}</span>
      {children && <DownOutlined />}
    </li>
  )
}

if (__DEV__) {
  MenuItem.displayName = 'MenuItem'
}
