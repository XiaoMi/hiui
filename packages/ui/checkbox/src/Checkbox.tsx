import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useCheckboxGroupContext } from './context'
import { HiBaseHTMLFieldProps, useGlobalContext } from '@hi-ui/core'
import { withDefaultProp } from '@hi-ui/react-utils'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'

const _role = 'checkbox'
const _prefix = getPrefixCls(_role)

/**
 * 复选框
 */
export const Checkbox = forwardRef<HTMLLabelElement | null, CheckboxProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      style,
      classNames: classNamesProp,
      styles: stylesProp,
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

    const { checkbox: checkboxConfig } = useGlobalContext()

    const { classNames, styles } = useMergeSemantic<
      CheckboxSemanticClassNames,
      CheckboxSemanticStyles,
      CheckboxProps
    >({
      classNamesList: [checkboxConfig?.classNames, classNamesProp],
      stylesList: [checkboxConfig?.styles, stylesProp],
      info: {
        props: {
          ...rest,
          disabled: disabledProp,
          indeterminate,
          checked: checkedProp,
          defaultChecked,
        },
      },
    })

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

    const cls = cx(prefixCls, className, classNames?.root, disabled && `${prefixCls}--disabled`)

    return (
      <label
        ref={ref}
        role={role}
        className={cls}
        style={{
          ...style,
          ...styles?.root,
        }}
        {...rest}
      >
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
            classNames?.icon,
            indeterminate && `${prefixCls}__icon--indeterminate`,
            checked && !indeterminate && `${prefixCls}__icon--checked`
          )}
          style={styles?.icon}
        />
        {children ? (
          <span className={cx(`${prefixCls}__text`, classNames?.text)} style={styles?.text}>
            {children}
          </span>
        ) : null}
      </label>
    )
  }
)

export type CheckboxSemanticName = 'root' | 'icon' | 'text'
export type CheckboxSemanticClassNames = SemanticClassNamesType<CheckboxProps, CheckboxSemanticName>
export type CheckboxSemanticStyles = SemanticStylesType<CheckboxProps, CheckboxSemanticName>
export type CheckboxSemantic = ComponentSemantic<CheckboxSemanticClassNames, CheckboxSemanticStyles>

export interface CheckboxProps extends HiBaseHTMLFieldProps<'label'>, CheckboxSemantic {
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
   * 	checkbox 表单控件的名称，用于 form 提交
   */
  name?: string
  /**
   * checkbox 表单控件绑定的值，用于 form 提交
   */
  value?: React.ReactText
  /**
   * 	值变化时的回调
   */
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void
}

if (__DEV__) {
  Checkbox.displayName = 'Checkbox'
}
