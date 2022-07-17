import React, { forwardRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { UserFilled } from '@hi-ui/icons'
import { HiBaseHTMLProps, HiBaseSizeEnum } from '@hi-ui/core'
import { useLatestRef } from '@hi-ui/use-latest'

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
      style: styleProp,
      className,
      children,
      src,
      size = 'md',
      shape = 'circle',
      bordered = false,
      initials,
      name,
      icon,
      srcSet,
      onError,
      ...rest
    },
    ref
  ) => {
    const onErrorLatestRef = useLatestRef(onError)
    const renderAvatar = useCallback(() => {
      if (src) {
        return (
          <img
            className={`${prefixCls}__image`}
            src={src}
            alt={name}
            onError={onErrorLatestRef.current}
          />
        )
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
    }, [src, initials, icon, name, children, prefixCls, onErrorLatestRef])

    const shouldUseSpecialSize = typeof size === 'number'

    const cls = cx(
      prefixCls,
      !shouldUseSpecialSize && `${prefixCls}--size-${size}`,
      `${prefixCls}--shape-${shape}`,
      bordered && `${prefixCls}--bordered`,
      className
    )

    let style = styleProp

    if (shouldUseSpecialSize) {
      const sizeVal = `${size}px`
      style = {
        width: sizeVal,
        height: sizeVal,
        lineHeight: sizeVal,
        // @ts-ignore
        fontSize: 0.56 * size,
        ...styleProp,
      }
    }

    return (
      <div ref={ref} role={role} className={cls} {...rest} style={style}>
        {renderAvatar()}
      </div>
    )
  }
)

export type AvatarSizeEnum = HiBaseSizeEnum | 'xs' | 'xl'

export interface AvatarProps extends HiBaseHTMLProps<'div'> {
  /**
   * 头像尺寸
   */
  size?: AvatarSizeEnum | number
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
  /**
   * 针对 img 不同的屏幕分辨率来源地址设置
   */
  srcSet?: string
  /**
   * 针对 img 加载失败回调
   */
  onError?: React.ReactEventHandler<HTMLImageElement>
  /**
   * 是否带边框
   */
  bordered?: boolean
}

if (__DEV__) {
  Avatar.displayName = 'Avatar'
}
