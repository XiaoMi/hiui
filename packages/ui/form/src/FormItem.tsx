import React from 'react'
import { __DEV__ } from '@hi-ui/env'
import { UseFormFieldProps } from './use-form-field'
import { FormLabel, FormLabelProps } from './FormLabel'
import { FormMessage } from './FormMessage'
import { FormField } from './FormField'

/**
 * TODO: What is FormItem
 */
export const FormItem: React.FC<FormItemProps> = ({ field, children, valueType, ...rest }) => {
  return (
    <FormLabel {...rest}>
      <FormField field={field} valueType={valueType}>
        {children}
      </FormField>
      {/* @ts-ignore */}
      <FormMessage field={field} />
    </FormLabel>
  )
}

export interface FormItemProps extends UseFormFieldProps, FormLabelProps {
  /**
   * 表单控件
   */
  children?: React.ReactElement
}

if (__DEV__) {
  FormItem.displayName = 'FormItem'
}
