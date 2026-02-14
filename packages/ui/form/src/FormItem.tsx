import React, { useMemo } from 'react'
import { __DEV__ } from '@hi-ui/env'
import { useFiledRules, UseFormFieldProps } from './use-form-field'
import { FormLabel, FormLabelProps } from './FormLabel'
import { FormMessage } from './FormMessage'
import { FormField } from './FormField'
import { useFormContext } from './context'
import { cx } from '@hi-ui/classname'
import { hasProperty } from '@hi-ui/object-utils'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'
import { useGlobalContext } from '@hi-ui/core'

export const FormItem: React.FC<FormItemProps> = ({
  className,
  style,
  classNames: classNamesProp,
  styles: stylesProp,
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
  const {
    prefixCls,
    showRequiredOnValidateRequired,
    formItemsRef,
    values,
    getFieldValue,
    addField,
    deleteField,
    autoRegister,
    formSemanticClassNames,
    formSemanticStyles,
  } = useFormContext()

  const { formItem: formItemConfig } = useGlobalContext()
  const formDefaultClassNames =
    formSemanticClassNames != null
      ? { label: formSemanticClassNames.label, content: formSemanticClassNames.content }
      : undefined
  const formDefaultStyles =
    formSemanticStyles != null
      ? { label: formSemanticStyles.label, content: formSemanticStyles.content }
      : undefined
  const { classNames, styles } = useMergeSemantic<
    FormItemSemanticClassNames,
    FormItemSemanticStyles,
    FormItemProps
  >({
    classNamesList: [formDefaultClassNames, formItemConfig?.classNames, classNamesProp],
    stylesList: [formDefaultStyles, formItemConfig?.styles, stylesProp],
    info: { props: { ...rest, field, required: rest.required } },
  })

  const fieldRules = useFiledRules({ field, rules, valueType })
  const { required } = rest

  const showRequired = useMemo(() => {
    if (required === undefined) {
      return showRequiredOnValidateRequired && fieldRules.some((item) => item.required)
    }
    return required
  }, [required, showRequiredOnValidateRequired, fieldRules])

  React.useEffect(() => {
    if (autoRegister) {
      if (field && !hasProperty(values, field)) {
        addField(field, getFieldValue(field) ?? (valueType === 'number' ? null : undefined))
      }
    }

    return () => {
      if (autoRegister) {
        field && deleteField(field)
      }
    }
  }, [addField, deleteField, field, getFieldValue])

  return (
    <FormLabel
      {...rest}
      ref={(ref) => {
        field && formItemsRef.current.set(field.toString(), ref)
      }}
      required={showRequired}
      // @ts-ignore
      formMessage={<FormMessage field={field} className={`${prefixCls}-item__message`} />}
      className={cx(`${prefixCls}-item`, className, classNames?.root)}
      style={{ ...style, ...styles?.root }}
      itemClassNames={{ label: classNames?.label, content: classNames?.content }}
      itemStyles={{ label: styles?.label, content: styles?.content }}
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

export type FormItemSemanticName = 'root' | 'label' | 'content'
export type FormItemSemanticClassNames = SemanticClassNamesType<FormItemProps, FormItemSemanticName>
export type FormItemSemanticStyles = SemanticStylesType<FormItemProps, FormItemSemanticName>
export type FormItemSemantic = ComponentSemantic<FormItemSemanticClassNames, FormItemSemanticStyles>

export interface FormItemProps extends UseFormFieldProps, FormLabelProps, FormItemSemantic {
  /**
   * 表单控件或其渲染函数
   */
  children?: React.ReactNode | ((props: Record<string, any>) => React.ReactNode)
  /**
   * 支持表单控件 render 渲染
   */
  render?: (props: Record<string, any>) => any
}

if (__DEV__) {
  FormItem.displayName = 'FormItem'
}
