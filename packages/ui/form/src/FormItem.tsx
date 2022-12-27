import React, { useMemo } from 'react'
import { __DEV__ } from '@hi-ui/env'
import { useFiledRules, UseFormFieldProps } from './use-form-field'
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
  const { prefixCls, showRequiredOnValidateRequired } = useFormContext()

  const fieldRules = useFiledRules({ field, rules, valueType })
  const { required } = rest

  const showRequired = useMemo(() => {
    if (required === undefined) {
      return showRequiredOnValidateRequired && fieldRules.some((item) => item.required)
    }
    return required
  }, [required, showRequiredOnValidateRequired, fieldRules])

  return (
    <FormLabel
      {...rest}
      required={showRequired}
      // @ts-ignore
      formMessage={<FormMessage field={field} className={`${prefixCls}-item__message`} />}
      className={cx(`${prefixCls}-item`, className)}
    >
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
    </FormLabel>
  )
}

export interface FormItemProps extends UseFormFieldProps, FormLabelProps {
  /**
   * 表单控件或其渲染函数
   */
  children?: React.ReactNode
  /**
   * 支持表单控件 render 渲染
   */
  render?: (props: Record<string, any>) => any
}

if (__DEV__) {
  FormItem.displayName = 'FormItem'
}
