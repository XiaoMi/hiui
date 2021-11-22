import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useFormContext } from './context'
import { ButtonProps } from '@hi-ui/button'
import { callAllFuncs } from '@hi-ui/func-utils'

const FORM_RESET_PREFIX = getPrefixCls('form-reset')

/**
 * TODO: What is FormReset
 */
export const FormReset = forwardRef<HTMLDivElement | null, FormResetProps>(
  ({ prefixCls = FORM_RESET_PREFIX, className, children, onClick, ...rest }, ref) => {
    const { resetForm } = useFormContext()

    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} className={cls} {...rest} onClick={callAllFuncs(resetForm, onClick)}>
        {children}
      </div>
    )
  }
)

export interface FormResetProps extends ButtonProps {}

if (__DEV__) {
  FormReset.displayName = 'FormReset'
}
