import React, { cloneElement, isValidElement } from 'react'
import { __DEV__ } from '@hi-ui/env'
import { useFormField, UseFormFieldProps } from './use-form-field'
import { isFunction } from '@hi-ui/type-assertion'

export const FormField: React.FC<FormFieldProps> = (props) => {
  const fieldProps = useFormField(props)

  if (isFunction(props.render)) {
    return props.render(fieldProps)
  }

  if (isFunction(props.children)) {
    return props.children(fieldProps)
  }

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
  children?: React.ReactNode
  /**
   * 支持表单控件 render 渲染
   */
  render?: (props: Record<string, any>) => React.ReactNode
}

if (__DEV__) {
  FormField.displayName = 'FormField'
}
