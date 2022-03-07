import React, { forwardRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { UserFilled } from '@hi-ui/icons'
import { HiBaseHTMLProps } from '@hi-ui/core'

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
    // TODO: 调整修饰类名
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
        <span aria-label={name} className={`${prefixCls}__content ${prefixCls}--empty`}>
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

export interface AvatarProps extends HiBaseHTMLProps<'div'> {
  /**
   * 头像尺寸
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /**
   * 头像缩写字母
   */
  initials?: string
  /**
   * 设置形状
   */
  shape?: 'circle' | 'square'
  /**
   * 头像 url
   */
  src?: string
  /**
   * 头像名，用于语义化设置
   */
  name?: string
  /**
   * 设置按钮图标
   */
  icon?: React.ReactNode
}

if (__DEV__) {
  Avatar.displayName = 'Avatar'
}
