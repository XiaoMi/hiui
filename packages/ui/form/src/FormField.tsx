import React, {
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useMemo,
  useCallback,
} from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { FormProvider, useFormContext } from './context'
import { useForm } from './use-form'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'
import Validater from '@flcwly/validater'

const EMPTY_RULES = [] as []
const _role = 'form-field'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is FormField
 */
export const FormField = forwardRef<HTMLFormElement | null, FormFieldProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      field,
      valuePropName = 'value',
      valueTrigger = 'onChange',
      validateTrigger = 'onChange',
      rules: rulesProp,
      ...rest
    },
    ref
  ) => {
    const formContext = useFormContext()
    const { getFieldProps, registerField, unregisterField, getFieldRules } = formContext

    const fieldRules = useMemo(() => {
      const rules = rulesProp ?? getFieldRules(field)
      return [].concat(rules)
    }, [rulesProp, field, getFieldRules])

    // 当前 field 的唯一校验器
    const fieldValidate = useCallback(
      (value: unknown, cb?: Function) => {
        if (!isArrayNonEmpty(fieldRules)) {
          cb?.()
          return
        }

        const validater = new Validater(fieldRules)

        return validater.validateOne(value)
      },
      [fieldRules]
    )

    // 注入当前 field 及其验证规则到 Form
    useEffect(() => {
      if (field) {
        registerField(field, {
          validate: fieldValidate,
        })
      }
      return () => {
        if (field) {
          unregisterField(field)
        }
      }
    }, [registerField, unregisterField, field, fieldValidate])

    if (!isValidElement(children)) {
      console.warn('FormField must pass a valid element as children.')
      return children
    }

    const fieldProps = getFieldProps({ field, rules: fieldRules, valuePropName, valueTrigger }, ref)

    const cls = cx(prefixCls, className)

    return cloneElement(children, { ...fieldProps, className: cls })
  }
)

export interface FormFieldProps {
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
   * 标签文本，默认自动添加冒号
   */
  label?: string
  /**
   * 	字段名
   */
  field?: string | string[]
  /**
   * 校验规则，设置字段的校验逻辑
   */
  rules?: object
  children?: React.ReactNode
  valuePropName?: any
  valueTrigger?: any
  validateTrigger?: any
}

if (__DEV__) {
  FormField.displayName = 'FormField'
}
