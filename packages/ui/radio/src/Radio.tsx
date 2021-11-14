import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useRadio, UseRadioProps } from './use-radio'

const RADIO_PREFIX = getPrefixCls('radio')

/**
 * TODO: What is Radio
 */
export const Radio = forwardRef<HTMLLabelElement | null, RadioProps>(
  ({ prefixCls = RADIO_PREFIX, role = 'radio', className, children, gap, ...rest }, ref) => {
    const { rootProps, getInputProps, getLabelProps } = useRadio(rest)

    const inputProps = getInputProps()
    const labelProps = getLabelProps()

    const cls = cx(prefixCls, className)

    return (
      <label ref={ref} role={role} className={cls} {...rootProps}>
        <input {...inputProps} />
        <span className={`${prefixCls}__controller`} />
        {children ? (
          <span className={`${prefixCls}__label`} {...labelProps}>
            {children}
          </span>
        ) : null}
      </label>
    )
  }
)

export interface RadioProps extends HiBaseHTMLProps<'label'>, UseRadioProps {}

if (__DEV__) {
  Radio.displayName = 'Radio'
}
