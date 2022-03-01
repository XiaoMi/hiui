import React from 'react'
import { __DEV__ } from '@hi-ui/env'
import { UseFormFieldProps } from './use-form-field'
import { FormLabel, FormLabelProps } from './FormLabel'
import { FormMessage } from './FormMessage'
import { FormField } from './FormField'
import { useFormContext } from './context'
import { cx } from '@hi-ui/classname'

/**
 * TODO: What is FormItem
 */
export const FormItem: React.FC<FormItemProps> = ({
  className,
  children,
  field,
  valueType,
  rules,
  valuePropName,
  valueChangeFuncPropName,
  valueDispatchTransform,
  valueConnectTransform,
  validateTrigger,
  render,
  ...rest
}) => {
  // @ts-ignore
  const { prefixCls } = useFormContext()

  return (
    <FormLabel {...rest} className={cx(`${prefixCls}-item`, className)}>
      <FormField
        field={field}
        valueType={valueType}
        rules={rules}
        valuePropName={valuePropName}
        valueChangeFuncPropName={valueChangeFuncPropName}
        valueDispatchTransform={valueDispatchTransform}
        valueConnectTransform={valueConnectTransform}
        validateTrigger={validateTrigger}
        render={render}
      >
        {children}
      </FormField>
      {/* @ts-ignore */}
      <FormMessage field={field} className={`${prefixCls}-item__message`} />
    </FormLabel>
  )
}

export interface FormItemProps extends UseFormFieldProps, FormLabelProps {
  /**
   * 表单控件
   */
  children?: React.ReactElement
  /**
   * 支持表单控件 render 渲染
   */
  render?: (props: Record<string, any>) => React.ReactElement
}

if (__DEV__) {
  FormItem.displayName = 'FormItem'
}
