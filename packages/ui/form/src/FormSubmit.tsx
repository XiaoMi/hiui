import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useFormContext } from './context'
import { ButtonProps } from '@hi-ui/button'
import { callAllFuncs } from '@hi-ui/func-utils'

const _role = 'form-submit'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is FormSubmit
 */
export const FormSubmit = forwardRef<HTMLDivElement | null, FormLabelProps>(
  ({ prefixCls = _prefix, role = _role, className, children, onClick, ...rest }, ref) => {
    const { submitForm } = useFormContext()

    const cls = cx(prefixCls, className)

    return (
      <div
        ref={ref}
        role={role}
        className={cls}
        {...rest}
        onClick={callAllFuncs(submitForm, onClick)}
      >
        {children}
      </div>
    )
  }
)

export interface FormLabelProps extends ButtonProps {}

if (__DEV__) {
  FormSubmit.displayName = 'FormSubmit'
}
