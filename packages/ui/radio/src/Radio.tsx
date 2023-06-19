import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLFieldProps } from '@hi-ui/core'
import { useRadio, UseRadioProps } from './use-radio'
import { useRadioGroupContext } from './context'
import { isNullish } from '@hi-ui/type-assertion'
import { callAllFuncs } from '@hi-ui/func-utils'

const RADIO_PREFIX = getPrefixCls('radio')

/**
 * 单选
 */
export const Radio = forwardRef<HTMLLabelElement | null, RadioProps>(
  ({ prefixCls = RADIO_PREFIX, role = 'radio', className, children, ...rest }, ref) => {
    const groupContext = useRadioGroupContext()
    const {
      disabled: disabledContext,
      isChecked: isCheckedContext,
      name: nameContext,
      onChange: onChangeContext,
      type = 'default',
      // From the use, Radio can be separated from RadioGroup.
    } = groupContext || {}

    const {
      checked: checkedProp,
      value: valueProp,
      // Group's priority is lower than its own.
      disabled = disabledContext,
      name = nameContext,
      onChange: onChangeProp,
    } = rest

    // Group's priority is higher than its own.
    const checked =
      isCheckedContext && !isNullish(valueProp) ? isCheckedContext(valueProp) : checkedProp

    const onChange =
      onChangeContext && !isNullish(valueProp)
        ? callAllFuncs((evt: React.ChangeEvent<HTMLInputElement>) => {
            if (evt.target.checked) {
              onChangeContext(valueProp)
            }
          }, onChangeProp)
        : onChangeProp

    const { rootProps, getInputProps } = useRadio({
      ...rest,
      disabled,
      name,
      checked,
      onChange,
    })

    const inputProps = getInputProps()

    const cls = cx(prefixCls, className, `${prefixCls}--type-${type}`)

    return (
      <label ref={ref} role={role} className={cls} {...rootProps}>
        <input {...inputProps} tabIndex={0} className={`${prefixCls}__input`} />
        <span className={`${prefixCls}__controller`} />
        {children ? <span className={`${prefixCls}__label`}>{children}</span> : null}
      </label>
    )
  }
)

export interface RadioProps extends HiBaseHTMLFieldProps<'label'>, UseRadioProps {}

if (__DEV__) {
  Radio.displayName = 'Radio'
}
