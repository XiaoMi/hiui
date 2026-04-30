import React, { useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { EllipsisOutlined } from '@hi-ui/icons'

const _role = 'pagination'
const _prefix = getPrefixCls(_role)

export const Pager: React.FC<PagerProps> = ({
  prefixCls = _prefix,
  onClick,
  page = '',
  active,
  className,
  style,
}) => {
  const cls = cx(
    `${prefixCls}__item`,
    {
      [`${prefixCls}__item--active`]: active,
      [`${prefixCls}__item--break`]: page === '...',
    },
    className
  )

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(page)
    }
  }, [page, onClick])

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleClick()
      }
    },
    [handleClick]
  )

  return (
    <li
      className={cls}
      style={style}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={page !== '...' ? 0 : -1}
    >
      {page === '...' ? <EllipsisOutlined style={{ fontSize: '14px' }} /> : page}
    </li>
  )
}

export interface PagerProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 页码
   */
  page?: number | string
  /**
   * 是否选中
   */
  active?: boolean
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 点击事件
   */
  onClick?: (page: number | string) => void
  /**
   * 自定义类名
   */
  className?: string
  /**
   * 自定义样式
   */
  style?: React.CSSProperties
}

if (__DEV__) {
  Pager.displayName = 'Pager'
}
