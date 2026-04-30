import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, useGlobalContext } from '@hi-ui/core'
import Spinner from '@hi-ui/spinner'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'

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
      style,
      classNames: classNamesProp,
      styles: stylesProp,
      children,
      type = 'default',
      size: sizeProp,
      appearance,
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

    const { size: globalSize, button: buttonConfig } = useGlobalContext()
    const size = sizeProp ?? globalSize ?? 'md'

    const { classNames, styles } = useMergeSemantic<
      ButtonSemanticClassNames,
      ButtonSemanticStyles,
      ButtonProps
    >({
      classNamesList: [buttonConfig?.classNames, classNamesProp],
      stylesList: [buttonConfig?.styles, stylesProp],
      info: { props: { ...rest, type, size, appearance, disabled, loading, shape } },
    })

    const prefix = loading ? (
      <Spinner
        color="currentColor"
        className={cx(`${prefixCls}__icon ${prefixCls}__icon--prefix`, classNames?.prefixIcon)}
        style={styles?.prefixIcon}
      />
    ) : icon && (!Array.isArray(icon) || icon[0]) ? (
      <span
        className={cx(`${prefixCls}__icon ${prefixCls}__icon--prefix`, classNames?.prefixIcon)}
        style={styles?.prefixIcon}
      >
        {Array.isArray(icon) ? icon[0] : icon}
      </span>
    ) : null

    const suffix =
      Array.isArray(icon) && icon.length > 1 ? (
        <span
          className={cx(`${prefixCls}__icon ${prefixCls}__icon--suffix`, classNames?.suffixIcon)}
          style={styles?.suffixIcon}
        >
          {icon[1]}
        </span>
      ) : null

    // 兼容 V4 版本，当 type 是 secondary 类型时，自动转换为 primary 类型，appearance 自动转换为 filled 外观
    let _type = type
    let _appearance = appearance
    if (type === 'secondary') {
      _type = 'primary'
    }
    if (type === 'secondary') {
      _appearance = 'filled'
    }

    // 如果未设置外观，则根据 type 自动设置外观
    if (!appearance) {
      if (['primary', 'success', 'danger'].includes(type)) {
        _appearance = 'solid'
      } else if (['default'].includes(type)) {
        // 默认使用灰色 line 外观
        _appearance = 'line'
      }
    }

    const cls = cx(
      prefixCls,
      className,
      classNames?.root,
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
        style={{
          ...style,
          ...styles?.root,
        }}
        disabled={isNonInteractive}
        type="button"
        {...(rest as any)}
      >
        {prefix}
        {children}
        {suffix}
      </button>
    ) : (
      <a
        ref={ref}
        role={role}
        href={href}
        className={cls}
        style={{
          ...style,
          ...styles?.root,
        }}
        {...(rest as any)}
      >
        {prefix}
        {children}
        {suffix}
      </a>
    )
  }
)

export type ButtonSemanticName = 'root' | 'prefixIcon' | 'suffixIcon'
export type ButtonSemanticClassNames = SemanticClassNamesType<ButtonProps, ButtonSemanticName>
export type ButtonSemanticStyles = SemanticStylesType<ButtonProps, ButtonSemanticName>
export type ButtonSemantic = ComponentSemantic<ButtonSemanticClassNames, ButtonSemanticStyles>

export interface ButtonProps extends HiBaseHTMLProps<'button' | 'a'>, ButtonSemantic {
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
