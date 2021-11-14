import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useRadioGroup, UseRadioGroupProps } from './use-radio-group'
import { RadioGroupProvider } from './context'

const RADIO_GROUP_PREFIX = getPrefixCls('RadioGroup')

/**
 * TODO: What is RadioGroup
 */
export const RadioGroup = forwardRef<HTMLDivElement | null, RadioGroupProps>(
  ({ prefixCls = RADIO_GROUP_PREFIX, className, children, ...rest }, ref) => {
    const { rootProps, name, value, onChange, isChecked, disabled } = useRadioGroup(rest)

    const providedValue = useMemo(
      () => ({
        name,
        onChange,
        value,
        isChecked,
        disabled,
      }),
      [name, onChange, value, isChecked, disabled]
    )

    const cls = cx(prefixCls, className)

    return (
      <RadioGroupProvider value={providedValue}>
        <div ref={ref} className={cls} {...rootProps}>
          {children}
        </div>
      </RadioGroupProvider>
    )
  }
)

export interface RadioGroupProps extends HiBaseHTMLProps<'div'>, UseRadioGroupProps {}

if (__DEV__) {
  RadioGroup.displayName = 'RadioGroup'
}
