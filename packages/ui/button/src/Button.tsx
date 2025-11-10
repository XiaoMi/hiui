import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, useGlobalContext } from '@hi-ui/core'
import Spinner from '@hi-ui/spinner'

const _role = 'button'
const _prefix = getPrefixCls(_role)

/**
 * 按钮
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      type = 'default',
      size: sizeProp,
      appearance = 'solid',
      disabled = false,
      loading = false,
      icon = null,
      shape = 'square',
      href,
      ...rest
    },
    ref
  ) => {
    const isEmptyChildren = !children || (typeof children === 'string' && !children.trim())
    const isNonInteractive = disabled || loading

    const prefix = loading ? (
      <Spinner color="currentColor" className={`${prefixCls}__icon ${prefixCls}__icon--prefix`} />
    ) : icon && (!Array.isArray(icon) || icon[0]) ? (
      <span className={`${prefixCls}__icon ${prefixCls}__icon--prefix`}>
        {Array.isArray(icon) ? icon[0] : icon}
      </span>
    ) : null

    const suffix =
      Array.isArray(icon) && icon.length > 1 ? (
        <span className={`${prefixCls}__icon ${prefixCls}__icon--suffix`}>{icon[1]}</span>
      ) : null

    const { size: globalSize } = useGlobalContext()
    const size = sizeProp ?? globalSize ?? 'md'
    // 兼容 V4 版本，当 type 是 secondary 类型时，自动转换为 primary 类型，appearance 自动转换为 filled 外观
    const _type = type === 'secondary' ? 'primary' : type
    const _appearance = type === 'secondary' ? 'filled' : appearance

    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--appearance-${_appearance}`,
      `${prefixCls}--size-${size}`,
      `${prefixCls}--type-${_type}`,
      `${prefixCls}--shape-${shape}`,
      isEmptyChildren && `${prefixCls}--icon-only`,
      disabled && `${prefixCls}--disabled`,
      loading && `${prefixCls}--loading`
    )

    return !href ? (
      <button
        ref={ref}
        role={role}
        className={cls}
        disabled={isNonInteractive}
        type="button"
        {...(rest as any)}
      >
        {prefix}
        {children}
        {suffix}
      </button>
    ) : (
      <a ref={ref} role={role} href={href} className={cls} {...(rest as any)}>
        {prefix}
        {children}
        {suffix}
      </a>
    )
  }
)

export interface ButtonProps extends HiBaseHTMLProps<'button' | 'a'> {
  /**
   * 设置按钮类型
   */
  type?: 'primary' | 'success' | 'danger' | 'default' | 'secondary'
  /**
   * 设置按钮尺寸
   */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  /**
   * 设置按钮外观
   */
  appearance?: 'solid' | 'filled' | 'link' | 'line' | 'text'
  /**
   * 设置按钮是否禁用
   */
  disabled?: boolean
  /**
   * 是否显示 loading
   */
  loading?: boolean
  /**
   * 设置按钮链接，设置后将用 a 标签渲染按钮
   */
  href?: string
  /**
   * 同 a 标签的 target 属性，仅在设置 href 后有效
   */
  target?: '_self' | '_blank' | '_parent' | '_top'
  /**
   * 设置按钮图标
   */
  icon?: React.ReactNode | React.ReactNode[]
  /**
   * 设置按钮形状
   */
  shape?: 'square' | 'round'
  /**
   * 	点击按钮时的回调
   */
  onClick?: (evt: React.MouseEvent) => void
}

// @ts-ignore
Button.HiName = 'Button'

if (__DEV__) {
  Button.displayName = 'Button'
}
