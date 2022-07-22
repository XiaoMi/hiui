import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const _role = 'button'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Button
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      type = 'default',
      size = 'md',
      appearance = 'filled',
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

    const prepend = loading ? (
      <IconLoading className={`${prefixCls}__icon`} />
    ) : icon ? (
      <span className={`${prefixCls}__icon`}>{icon}</span>
    ) : null

    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--appearance-${appearance}`,
      `${prefixCls}--size-${size}`,
      `${prefixCls}--type-${type}`,
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
        {prepend}
        {children}
      </button>
    ) : (
      <a ref={ref} role={role} href={href} className={cls} {...(rest as any)}>
        {prepend}
        {children}
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
  size?: 'lg' | 'sm' | 'md' | 'xl'
  /**
   * 设置按钮外观
   * 其中 `unset` 暂不对外
   */
  appearance?: 'filled' | 'link' | 'line' | 'unset'
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
  icon?: React.ReactNode
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

// TODO: 提取
function IconLoading({ className = '', size = '0.8em' }) {
  return (
    <i className={cx(className)}>
      <svg viewBox="0 0 18 18" width={size} height={size} fill="currentColor">
        <g>
          <path
            d="m9 18c-4.9706 0-9-4.0294-9-9 0-4.9706 4.0294-9 9-9 4.9706 0 9 4.0294 9 9 0 4.9706-4.0294 9-9 9zm0-2c3.866 0 7-3.134 7-7 0-3.866-3.134-7-7-7-3.866 0-7 3.134-7 7 0 3.866 3.134 7 7 7z"
            opacity=".15"
          />
          <path d="m15.547 2.8242c0.37904 0.40168 0.36068 1.0346-0.040996 1.4136-0.40168 0.37904-1.0346 0.36068-1.4136-0.040996-1.315-1.3935-3.1381-2.1969-5.0922-2.1969-3.866 0-7 3.134-7 7 0 0.55228-0.44772 1-1 1s-1-0.44772-1-1c0-4.9706 4.0294-9 9-9 2.5103 0 4.8578 1.0343 6.5468 2.8242z" />
        </g>
      </svg>
    </i>
  )
}
