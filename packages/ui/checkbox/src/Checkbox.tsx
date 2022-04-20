import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useCheckboxGroupContext } from './context'
import { HiBaseHTMLFieldProps } from '@hi-ui/core'
import { withDefaultProp } from '@hi-ui/react-utils'

const _role = 'checkbox'
const _prefix = getPrefixCls(_role)

/**
 * 复选
 *
 * TODO:
 * 1. 受控示例
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
      name: nameGroup,
      value: valueGroup,
      onChange: onChangeGroup,
    } = useCheckboxGroupContext()

    const disabled = withDefaultProp(withDefaultProp(disabledProp, disabledGroup), false) as boolean

    const checkedWithContext =
      checkedProp ?? (valueGroup && value !== undefined ? valueGroup.includes(value) : checkedProp)

    const [checked, tryChangeChecked] = useUncontrolledState(
      defaultChecked,
      checkedWithContext,
      (_: boolean, evt: React.ChangeEvent<HTMLInputElement>) => {
        onChangeProp?.(evt)
        onChangeGroup?.(evt, value)
      }
    )

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      evt.stopPropagation()

      if (disabled) return
      tryChangeChecked(evt.target.checked, evt)
    }

    const cls = cx(prefixCls, className, disabled && `${prefixCls}--disabled`)

    return (
      <label ref={ref} role={role} className={cls} {...rest}>
        <input
          className={`${prefixCls}__input`}
          type="checkbox"
          // input 将被隐藏，只使用其交互功能，UI 使用 span 自定义绘制
          aria-hidden="true"
          autoFocus={autoFocus}
          disabled={disabled}
          name={name ?? nameGroup}
          value={value}
          checked={checked}
          onChange={handleChange}
          onClick={(evt) => evt.stopPropagation()}
        />
        <span
          className={cx(
            `${prefixCls}__icon`,
            indeterminate && `${prefixCls}__icon--indeterminate`,
            checked && !indeterminate && `${prefixCls}__icon--checked`
          )}
        />
        {children ? <span className={`${prefixCls}__text`}>{children}</span> : null}
      </label>
    )
  }
)

export interface CheckboxProps extends HiBaseHTMLFieldProps<'label'> {
  /**
   * 	是否自动获取焦点
   */
  autoFocus?: boolean
  /**
   * 	是否选中
   */
  checked?: boolean
  /**
   * 	是否默认选中
   */
  defaultChecked?: boolean
  /**
   * 	是否禁用
   */
  disabled?: boolean
  /**
   * 	不全选的样式控制，优先级大于 checked
   */
  indeterminate?: boolean
  /**
   * 	变化时的回调
   */
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void
  /**
   * 	checkbox 表单控件的名称，用于 form 提交
   */
  name?: string
  /**
   * checkbox 表单控件绑定的值，用于 form 提交
   */
  value?: React.ReactText
}

if (__DEV__) {
  Checkbox.displayName = 'Checkbox'
}
