import { useEffect, useCallback, useMemo } from 'react'
import { FormFieldPath, FormRuleModel } from './types'
import { useFormContext } from './context'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'
import Validater from 'async-validator'
import { toArray } from '@hi-ui/func-utils'
// import yup from 'yup'

export const useFormField = <Values = any>(props: UseFormFieldProps<Values>) => {
  const { field, rules: rulesProp, valueType } = props

  const {
    // setFieldValue,
    // setFieldError,
    // setFieldTouched,
    // getFieldError,
    getFieldRules,
    getFieldProps,
    registerField,
    unregisterField,
  } = useFormContext()

  /**
   * 处理校验规则，item 优先级大于 form
   */
  const fieldRules = useMemo(() => {
    // @ts-ignore
    const rules = toArray(rulesProp ?? getFieldRules(field))

    // switch(valueType) {
    //   case: 'string':
    //     const scheme = yup.string()
    //     rules.reduce((scheme, { name, strategy, validator, message, transform }) => {
    //       if (typeof name === 'string' && name in scheme) {
    //         if (isFunction(transform)) {
    //           scheme = scheme.transform(transform)
    //         }

    //         // @ts-ignore
    //         return scheme[name](message)
    //       }
    //     }, scheme)
    //   case: 'number':
    //   case: 'boolean':
    //   case: 'array':
    //   case: 'object':
    //   case: 'date':
    // }
    return rules.map((rule) => ({ type: valueType, ...rule }))
  }, [rulesProp, field, getFieldRules, valueType])

  // 当前 field 的唯一校验器
  const fieldValidate = useCallback(
    (value: unknown) => {
      if (!isArrayNonEmpty(fieldRules)) {
        return Promise.resolve(null)
      }

      // TODO: rules 处理成 Async Validate 的指定结构
      console.log('fieldRules', fieldRules, 'value:', value)

      const validater = new Validater({
        // @ts-ignore
        [field]: fieldRules,
      })
      // @ts-ignore
      return validater.validate({ [field]: value }, { firstFields: true }, console.log)
    },
    [fieldRules, field]
  )

  // 注入当前 field 及其验证规则到 Form
  useEffect(() => {
    if (field) {
      // @ts-ignore
      registerField(field, {
        validate: fieldValidate,
      })
    }

    return () => {
      if (field) {
        // @ts-ignore
        unregisterField(field)
      }
    }
  }, [registerField, unregisterField, field, fieldValidate])

  return getFieldProps(props)
}

export interface UseFormFieldProps<T = Record<string, any>> {
  /**
   * 字段名，支持数组
   */
  field: FormFieldPath
  /**
   * 指定控件值数据结构类型
   */
  valueType: 'string' | 'boolean' | 'number' | 'array' | 'object' | 'date'
  /**
   * 设置字段的验证规则，会覆盖 Form 设置的 rules
   */
  rules?: FormRuleModel[]
  /**
   * 自定义设置 Form 往表单控件注入值的属性，如 Switch Radio Checkbox 的是 'checked'
   */
  valuePropName?: string
  /**
   * form 从控件个体采集数据的转换器，最终会把返回值转发给 Form
   */
  valueSync?: (value: any) => T
  /**
   * 自定义设置 Form 从表单控件采集数据回调的属性
   */
  onChangePropName?: string
  /**
   * 设置触发该字段校验的时机，会覆盖 Form 设置的 validateTrigger
   */
  validateTrigger?: string | string[]
}
