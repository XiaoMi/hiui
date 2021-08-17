import React, { forwardRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useCheckboxGroupContext } from './context'

const _role = 'checkbox'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Checkbox
 */
export const Checkbox = forwardRef<HTMLLabelElement | null, CheckboxProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      name,
      value,
      focusable = true,
      disabled: disabledProp,
      indeterminate = false,
      autoFocus = false,
      defaultChecked = false,
      checked: checkedProp,
      onChange: onChangeProp,
      ...rest
    },
    ref
  ) => {
    const {
      disabled: disabledGroup,
      value: valueGroup,
      onChange: onChangeGroup,
    } = useCheckboxGroupContext()

    const onChange = useCallback(
      (_: boolean, evt: React.ChangeEvent<HTMLInputElement>) => {
        // TODO: 约定所有该类型组件的双重回调的执行顺序，子优于父（方便单独设置，父作为默认）
        onChangeProp?.(evt)
        onChangeGroup?.(evt)
      },
      [onChangeProp, onChangeGroup]
    )

    const checkedWithContext =
      checkedProp ?? (valueGroup && value !== undefined ? valueGroup.includes(value) : false)

    const disabled = disabledProp ?? disabledGroup

    const [checked, tryChangeChecked] = useUncontrolledState(
      defaultChecked,
      checkedWithContext,
      onChange
    )

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return

      tryChangeChecked(evt.target.checked, evt)
    }

    // TODO: 统一约定组件库 className 和 自定义样式控制先后顺序
    const cls = cx(prefixCls, disabled && `${prefixCls}--disabled`, className)

    const iconCls = cx(
      `${prefixCls}__icon`,
      // TODO: 约定所有 className 写法，使用 && 或 三元
      indeterminate && `${prefixCls}__icon--indeterminate`,
      checked && !indeterminate && `${prefixCls}__icon--checked`
    )

    return (
      <label ref={ref} role={role} className={cls} {...rest}>
        <input
          className={`${prefixCls}__input`}
          type="checkbox"
          aria-hidden="true"
          autoFocus={autoFocus}
          disabled={disabled}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          tabIndex={focusable ? 0 : -1}
        />
        <span className={iconCls} />
        {children ? <span className={`${prefixCls}__text`}>{children}</span> : null}
      </label>
    )
  }
)

export interface CheckboxProps {
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
  autoFocus?: boolean
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  indeterminate?: boolean
  name?: string
  focusable?: boolean
  // TODO: 约定所有表单组件兼容 number | string
  value?: React.ReactText
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void
  onClick?: (evt: React.MouseEvent<HTMLLabelElement>) => void
}

if (__DEV__) {
  Checkbox.displayName = 'Checkbox'
}
