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
export const FormSubmit = forwardRef<HTMLButtonElement | HTMLAnchorElement | null, FormSubmitProps>(
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
              // @ts-ignore
              onClick?.(result, null)
            })
            .catch((error) => {
              // @ts-ignore
              onClick?.(null, error)
            })
        }}
      >
        {children}
      </Button>
    )
  }
)

export interface FormSubmitProps extends Omit<ButtonProps, 'onClick'> {
  /**
   * 点击提交后触发
   */
  onClick?: () => void
}

if (__DEV__) {
  FormSubmit.displayName = 'FormSubmit'
}
