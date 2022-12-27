import React, { forwardRef, useImperativeHandle } from 'react'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useFormContext } from './context'
import { setNested, getNested } from '@hi-ui/object-utils'
import { isArray, isArrayNonEmpty } from '@hi-ui/type-assertion'
import { FormFieldPath, FormListChildrenAction, FormListHelper, FormState } from './types'

const fieldListSymbol = Symbol('field-list')

/**
 * TODO: What is FormList
 */
export const FormList = forwardRef<HTMLDivElement | null, FormListProps>(
  ({ children, name: nameProp, innerRef }, ref) => {
    const { values, setFormState } = useFormContext()

    // 唯一 id 生成器
    // const listCountRef = React.useRef(0)

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        updateFormList((prev: any) => [...asArray(prev), value], false, false)
      },
      [updateFormList]
    )

    const remove = React.useCallback(
      (index: number) => {
        updateFormList((prev: any) => asArray(prev).filter((_, idx) => idx !== index), true, true)
      },
      [updateFormList]
    )

    const insertBefore = React.useCallback(
      (index: number, value: any) => {
        updateFormList(
          (prev: any[]) => insert(asArray(prev), index, value),
          (prev: any[]) => insert(asArray(prev), index, null),
          (prev: any[]) => insert(asArray(prev), index, null)
        )
      },
      [updateFormList]
    )

    const swap = React.useCallback(
      (aIndex: number, bIndex: number) => {
        updateFormList(
          (prev: any[]) => {
            const copy = [...asArray(prev)]
            const temp = copy[aIndex]
            copy[aIndex] = copy[bIndex]
            copy[bIndex] = temp
            return copy
          },
          true,
          true
        )
      },
      [updateFormList]
    )

    const move = React.useCallback(
      (fromIndex: number, toIndex: number) => {
        updateFormList(
          (prev: any[]) => {
            const copy = [...asArray(prev)]
            const temp = copy[fromIndex]

            copy.splice(fromIndex, 1)
            copy.splice(toIndex, 0, temp)
            return copy
          },
          true,
          true
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

    // @ts-ignore
    useImperativeHandle(innerRef, () => {
      return {
        add,
        remove,
        insertBefore,
        swap,
        move,
      }
    })

    if (typeof children !== 'function') {
      if (__DEV__) {
        console.warn(false, 'FormList only accepts a render function as children.')
      }
      return null
    }

    return children(listFields, { add, remove, swap, insertBefore, move })
  }
)

export interface FormListProps extends HiBaseHTMLProps<'div'> {
  /**
   * 表单控件渲染函数
   */
  children?: (fields: any[], action: FormListChildrenAction) => React.ReactElement
  /**
   * 列表名称
   */
  name: FormFieldPath
  /**
   * 提供辅助方法的内部引用
   */
  innerRef?: React.Ref<FormListHelper>
}

if (__DEV__) {
  FormList.displayName = 'FormList'
}

const insert = (arr: any[], index: number, value: any) => {
  arr = [...arr]
  arr.splice(index, 0, value)
  return arr
}

const asArray = (arr: any) => {
  return isArray(arr) ? arr : []
}
