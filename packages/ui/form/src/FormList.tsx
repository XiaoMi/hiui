import React from 'react'
import { __DEV__ } from '@hi-ui/env'
import { useFormContext } from './context'
import { setNested, getNested } from '@hi-ui/func-utils'
import { isArray, isArrayNonEmpty } from '@hi-ui/type-assertion'
import { FormState } from './types'
import { UseFormFieldProps } from './use-form-field'
import { FormLabelProps } from './FormLabel'

const fieldListSymbol = Symbol('field-list')

interface FormFields {
  // 唯一
  name: string
  // sort
  field: string
  symbol: Symbol
}

/**
 * TODO: What is FormList
 */
export const FormList: React.FC<FormListProps> = ({ children, name: nameProp }) => {
  const { values, getFieldError, setFormState } = useFormContext()

  // 唯一 id 生成器
  const listCountRef = React.useRef(0)

  const name = isArray(nameProp) ? nameProp : [nameProp]

  /**
   * form List 动态字段更新器
   */
  const updateFormList = React.useCallback(
    (stateFunc: Function, alterTouched: boolean | Function, alterErrors: boolean | Function) => {
      setFormState((prev: FormState<any>) => {
        const values = setNested(prev.values, name, stateFunc(getNested(prev.values, name)))

        const updateErrors = typeof alterErrors === 'function' ? alterErrors : stateFunc
        const updateTouched = typeof alterTouched === 'function' ? alterTouched : stateFunc

        let fieldError = alterErrors ? updateErrors(getNested(prev.errors, name)) : undefined
        let fieldTouched = alterTouched ? updateTouched(getNested(prev.touched, name)) : undefined

        if (!isArrayNonEmpty(fieldError)) {
          fieldError = undefined
        }

        if (!isArrayNonEmpty(fieldTouched)) {
          fieldTouched = undefined
        }

        return {
          values,
          errors: alterErrors ? setNested(prev.errors, name, fieldError) : prev.errors,
          touched: alterTouched ? setNested(prev.touched, name, fieldTouched) : prev.touched,
        } as FormState<any>
      })
    },
    [name, setFormState]
  )

  const add = React.useCallback(
    (value: any) => {
      // 维护的 动态 field list
      updateFormList((prev: any) => prev.concat(value), false, false)
    },
    [updateFormList]
  )

  const remove = React.useCallback(
    (index: number) => {
      updateFormList((prev: any) => prev.filter((_, idx) => idx !== index), false, false)
    },
    [updateFormList]
  )

  const insertBefore = React.useCallback(
    (value: any, index: number) => {
      updateFormList(
        (prev: any[]) => insert(prev, index, value),
        (prev: any[]) => insert(prev, index, null),
        (prev: any[]) => insert(prev, index, null)
      )
    },
    [updateFormList]
  )

  const listFields = React.useMemo(() => {
    const list = getNested(values, name) || []

    // @ts-ignore
    return list.map((value, index) => {
      return {
        name: '' + index,
        // field: ++listCountRef.current + '',
        symbol: fieldListSymbol,
        value: value,
      }
    })
  }, [values, name])

  if (typeof children !== 'function') {
    if (__DEV__) {
      console.warn(false, 'FormList only accepts a render function as children.')
    }
    return null
  }

  return children(listFields, { add, remove, insertBefore })
}

export interface FormListProps extends UseFormFieldProps, FormLabelProps {
  /**
   * 表单控件
   */
  children?: (fields: any[], action: any) => React.ReactElement | null
  /**
   * 列表名称
   */
  name: string | string[]
}

if (__DEV__) {
  FormList.displayName = 'FormList'
}

const insert = (arr: any[], index: number, value: any) => {
  return [...arr].splice(index, 0, value)
}
