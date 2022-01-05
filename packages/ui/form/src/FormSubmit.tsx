import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useFormContext } from './context'
import Button, { ButtonProps } from '@hi-ui/button'

const _role = 'form-submit'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is FormSubmit
 */
export const FormSubmit = forwardRef<HTMLButtonElement | HTMLAnchorElement | null, FormLabelProps>(
  (
    { prefixCls = _prefix, role = _role, className, children, type = 'primary', onClick, ...rest },
    ref
  ) => {
    const { submitForm } = useFormContext()

    const cls = cx(prefixCls, className)

    return (
      <Button
        ref={ref}
        role={role}
        className={cls}
        type={type}
        {...rest}
        onClick={(evt) => {
          evt.preventDefault()
          evt.stopPropagation()

          submitForm()
            .then((result) => {
              onClick?.(result, null)
            })
            .catch((error) => {
              onClick?.(null, error)
            })
        }}
      >
        {children}
      </Button>
    )
  }
)

export interface FormLabelProps extends Omit<ButtonProps, 'onClick'> {
  // TODO: 重新设计
  onClick?: (value: any, error: any) => void
}

if (__DEV__) {
  FormSubmit.displayName = 'FormSubmit'
}
