import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useFormContext } from './context'
import Button, { ButtonProps } from '@hi-ui/button'

const FORM_RESET_PREFIX = getPrefixCls('form-reset')

/**
 * TODO: What is FormReset
 */
export const FormReset = forwardRef<HTMLButtonElement | null, FormResetProps>(
  (
    { prefixCls = FORM_RESET_PREFIX, className, children, type = 'secondary', onClick, ...rest },
    ref
  ) => {
    const { resetForm } = useFormContext()

    const cls = cx(prefixCls, className)
    return (
      <Button
        ref={ref}
        className={cls}
        type={type}
        {...rest}
        onClick={() => {
          resetForm()
          onClick?.()
        }}
      >
        {children}
      </Button>
    )
  }
)

export interface FormResetProps extends ButtonProps {
  /**
   * 点击重置后触发
   */
  onClick?: () => void
}

if (__DEV__) {
  FormReset.displayName = 'FormReset'
}
