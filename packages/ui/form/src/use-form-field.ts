import { useEffect, useCallback, useMemo } from 'react'
import { FormFieldPath, FormRuleModel, FormRuleType } from './types'
import { useFormContext } from './context'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'
import Validater, { Rules } from 'async-validator'
import { normalizeArray } from '@hi-ui/array-utils'
import { isValidField, stringify } from './utils'

export const useFiledRules = <Values = any>(props: UseFormFieldProps<Values>) => {
  const { field, rules: rulesProp, valueType = 'any' } = props
  const { getFieldRules } = useFormContext()

  /**
   * 处理校验规则，item 优先级大于 form
   */
  const fieldRules: Rules[] = useMemo(() => {
    // @ts-ignore
    const rules = normalizeArray(rulesProp ?? getFieldRules(field))
    return rules.map((rule: any) => ({ type: valueType, ...rule }))
  }, [rulesProp, field, getFieldRules, valueType])

  return fieldRules
}

export const useFormField = <Values = any>(props: UseFormFieldProps<Values>) => {
  const { field, valueType } = props

  const { getFieldProps, registerField, unregisterField } = useFormContext()

  const fieldRules: Rules[] = useFiledRules(props)

  // 当前 field 的唯一校验器
  const fieldValidate = useCallback(
    (value: unknown) => {
      if (!isArrayNonEmpty(fieldRules)) {
        return Promise.resolve(null)
      }

      // TODO: rules 处理成 Async Validate 的指定结构
      const fieldMD5 = stringify(field as FormFieldPath)

      const validater = new Validater({ [fieldMD5]: fieldRules })
      return validater.validate(
        {
          [fieldMD5]:
            valueType !== 'number' || value === ''
              ? value
              : isNaN(value as number)
              ? value
              : Number(value),
        },
        { firstFields: true }
      )
    },
    [fieldRules, field, valueType]
  )

  // 注入当前 field 及其验证规则到 Form
  useEffect(() => {
    if (!isValidField(field)) return

    registerField(field, {
      validate: fieldValidate,
    })

    return () => {
      if (!isValidField(field)) return

      unregisterField(field)
    }
  }, [registerField, unregisterField, field, fieldValidate])

  return getFieldProps(props)
}

export interface UseFormFieldProps<T = any> {
  /**
   * 字段名，支持数组
   */
  field?: FormFieldPath
  /**
   * 指定控件值数据结构类型
   */
  valueType?: FormRuleType
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
  valueDispatchTransform?: (...args: any[]) => T
  /**
   * 控件个体接收 form 下发数据的转换器，最终会把返回值转发给 FormField
   */
  valueConnectTransform?: (value: any) => T
  /**
   * 自定义设置 Form 从表单控件采集数据回调的属性
   */
  valueChangeFuncPropName?: string
  /**
   * 设置触发该字段校验的时机（值必须是回调函数），会覆盖 Form 设置的 validateTrigger
   */
  validateTrigger?: string | string[]
}
