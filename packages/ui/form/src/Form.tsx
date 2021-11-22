import React, { forwardRef, useCallback, useImperativeHandle, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { FormProvider } from './context'
import { useForm, UseFormProps } from './use-form'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { FormRuleModel, FormHelpers } from './types'

const _role = 'form'
const _prefix = getPrefixCls(_role)

// form 注册表
const FORM_REGISTER_TABLE: Record<string, FormRuleModel> = {}

/**
 * TODO: What is Form
 */
export const Form = forwardRef<HTMLFormElement | null, FormProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      innerRef,
      labelWidth,
      labelPlacement = 'right',
      placement,
      verticalAlign,
      colon,
      ...rest
    },
    ref
  ) => {
    const formContext = useForm(rest)

    const { getRootProps } = formContext
    // useImperativeHandle(innerRef, () => formContext)

    const providedValue = useMemo(() => {
      return {
        labelWidth,
        labelPlacement,
        colon,
        ...formContext,
      }
    }, [labelWidth, formContext, labelPlacement, colon])

    const cls = cx(prefixCls, className)

    return (
      <FormProvider value={providedValue}>
        <form ref={ref} role={role} className={cls} {...rest} {...getRootProps()}>
          {children}
        </form>
      </FormProvider>
    )
  }
)

export interface FormProps<Values = Record<string, any>>
  extends Omit<HiBaseHTMLProps<'form'>, 'onSubmit' | 'onReset'>,
    UseFormProps<Values> {
  /**
   * 提供辅助方法的内部引用
   */
  innerRef?: React.RefObject<FormHelpers<Values>>
  /**
   * label 宽度，可用任意 CSS 长度单位
   */
  labelWidth?: React.ReactText
  /**
   * label 对齐的方式
   */
  labelPlacement?: 'left' | 'right' | 'top'
  /**
   * label 和表单控件的放置方式
   */
  placement?: 'vertical' | 'horizontal'
  /**
   * 在 vertical 放置时，label 相对表单控件垂直对齐的方式
   */
  verticalAlign?: 'top' | 'center' | 'bottom'
  /**
   * 配置是否展示冒号
   */
  colon?: boolean
}

if (__DEV__) {
  Form.displayName = 'Form'
}

// @ts-ignore
Form.extends = (model: FormRuleModel) => {
  if (typeof model.name === 'string') {
    FORM_REGISTER_TABLE[model.name] = model
  } else {
    if (__DEV__) {
      console.log('WARNING: the name should be unique string and not empty.')
    }
  }
}
