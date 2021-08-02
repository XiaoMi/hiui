import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

const _role = 'button'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Button
 */
export const Button = forwardRef<any, ButtonProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      type = 'default',
      size = 'md',
      appearance = 'button',
      disabled = false,
      loading = false,
      fullWidth = false,
      icon = null,
      as: As = 'button',
      ...rest
    },
    ref
  ) => {
    const isEmptyChildren = !children || (typeof children === 'string' && !children.trim())

    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--appearance-${appearance}`,
      `${prefixCls}--size-${size}`,
      `${prefixCls}--type-${type}`,
      isEmptyChildren && `${prefixCls}--icon-only`,
      disabled && `${prefixCls}--disabled`,
      loading && `${prefixCls}--loading`,
      fullWidth && `${prefixCls}--full-width`
    )

    const isNonInteractive = disabled || loading

    return (
      <As ref={ref} role={role} className={cls} disabled={isNonInteractive} {...rest}>
        {loading ? <IconLoading className={`${prefixCls}__icon`} /> : icon}
        {children}
      </As>
    )
  }
)

export interface ButtonProps {
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
  /**
   * 组件的孩子节点
   */
  children?: React.ReactNode
  /**
   * 设置按钮类型
   */
  type?: 'primary' | 'line' | 'success' | 'danger' | 'default'
  /**
   * 设置按钮外观
   */
  size?: 'lg' | 'sm' | 'md'
  /**
   * 设置铺满宽度
   */
  fullWidth?: boolean
  /**
   * 设置按钮外观
   */
  appearance?: 'button' | 'link'
  /**
   * 设置按钮是否禁用
   */
  disabled?: boolean
  /**
   * 	点击按钮时的回调
   */
  onClick?: (evt: React.MouseEvent) => void
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
   * 设置容器的 dom 类型
   */
  as?: 'button' | 'a'
}

if (__DEV__) {
  Button.displayName = 'Button'
}

// TODO: 提取
function IconLoading({ className = '', size = '0.8em' }) {
  return (
    <i className={cx('hi-v4-icon', className)}>
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
