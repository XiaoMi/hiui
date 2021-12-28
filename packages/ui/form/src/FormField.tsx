import React, { cloneElement, isValidElement } from 'react'
import { __DEV__ } from '@hi-ui/env'
import { useFormField, UseFormFieldProps } from './use-form-field'

/**
 * TODO: What is FormField
 */
export const FormField: React.FC<FormFieldProps> = (props) => {
  const fieldProps = useFormField(props)

  if (!isValidElement(props.children)) {
    console.warn('FormField must pass a valid element as children.')
    return props.children ?? null
  }

  return cloneElement(props.children, { ...fieldProps })
}

export interface FormFieldProps extends UseFormFieldProps {
  /**
   * 表单控件
   */
  children?: React.ReactElement
}

if (__DEV__) {
  FormField.displayName = 'FormField'
}
