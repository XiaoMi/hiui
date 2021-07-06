import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

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
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, `${prefixCls}--${size}`, `${prefixCls}--${shape}`, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {src ? (
          <img className={`${prefixCls}__image`} src={src} alt={name} />
        ) : (
          <span aria-label={name} className={`${prefixCls}__initials`}>
            {initials}
          </span>
        )}
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
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  initials?: string
  shape?: 'circle' | 'square'
  src?: string
  name?: string
}

if (__DEV__) {
  Avatar.displayName = 'Avatar'
}
