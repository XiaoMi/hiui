import React, { forwardRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { UserFilled } from '@hi-ui/icons'

const _role = 'avatar'
const _prefix = getPrefixCls(_role)

/**
 * 头像组件
 */
export const Avatar = forwardRef<HTMLDivElement | null, AvatarProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      src,
      size = 'md',
      shape = 'circle',
      initials,
      name,
      icon,

      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, `${prefixCls}--${size}`, `${prefixCls}--${shape}`, className)

    const renderAvatar = useCallback(() => {
      if (src) {
        return <img className={`${prefixCls}__image`} src={src} alt={name} />
      }
      if (icon) {
        return (
          <span aria-label={name} className={`${prefixCls}__content`}>
            {icon}
          </span>
        )
      }
      if (initials) {
        return (
          <span aria-label={name} className={`${prefixCls}__content`}>
            {initials}
          </span>
        )
      }
      if (children) {
        return (
          <span aria-label={name} className={`${prefixCls}__content`}>
            {children}
          </span>
        )
      }
      return (
        <span aria-label={name} className={`${prefixCls}__content`}>
          <UserFilled />
        </span>
      )
    }, [src, initials, icon, name, children, prefixCls])

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {renderAvatar()}
      </div>
    )
  }
)

export interface AvatarProps {
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
  children?: React.ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  initials?: string
  shape?: 'circle' | 'square'
  src?: string
  name?: string
  /**
   * 设置按钮图标
   */
  icon?: React.ReactNode
}

if (__DEV__) {
  Avatar.displayName = 'Avatar'
}
