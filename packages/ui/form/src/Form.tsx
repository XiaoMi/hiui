import React, { forwardRef, useImperativeHandle, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { FormProvider } from './context'
import { useForm } from './use-form'

const _role = 'form'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Form
 */
export const Form = forwardRef<HTMLFormElement | null, FormProps>(
  ({ prefixCls = _prefix, role = _role, className, children, innerRef, ...rest }, ref) => {
    const formContext = useForm(rest)

    useImperativeHandle(innerRef, () => formContext)

    const cls = cx(prefixCls, className)

    return (
      <FormProvider value={formContext}>
        <form
          ref={ref}
          role={role}
          className={cls}
          {...rest}
          onSubmit={(evt: React.FormEvent<HTMLFormElement>) => {}}
          onReset={(evt) => {}}
        >
          {children}
        </form>
      </FormProvider>
    )
  }
)

export interface FormProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 组件的注入样式
   */
  style?: React.CSSProperties
  /**
   * 校验规则，设置字段的校验逻辑
   */
  rules: object
  /**
   * label 放置的位置
   * TODO: 拆成 2 个，一个表示对齐，另一个表示位置
   */
  labelPlacement: 'right' | 'left' | 'top'
  labelWidth: React.ReactText
  placement: 'horizontal' | 'vertical'
  inline: boolean
  onSubmit: () => void
  showColon: boolean
}

if (__DEV__) {
  Form.displayName = 'Form'
}
