import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useFormContext } from './context'
import Button, { ButtonProps } from '@hi-ui/button'
import { GlobalConfig } from '@hi-ui/core'

const _prefix = getPrefixCls('form-reset')

export const FormReset = forwardRef<HTMLButtonElement | null, FormResetProps>(
  ({ prefixCls: prefixClsProp, className, children, type, onClick, ...rest }, ref) => {
    const globalPrefixCls = GlobalConfig.prefixCls
    const prefixCls =
      prefixClsProp || (globalPrefixCls && getPrefixCls('form-reset', globalPrefixCls)) || _prefix
    const { resetForm } = useFormContext()

    const cls = cx(prefixCls, className)
    return (
      <Button
        ref={ref}
        className={cls}
        type={type}
        appearance="line"
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
