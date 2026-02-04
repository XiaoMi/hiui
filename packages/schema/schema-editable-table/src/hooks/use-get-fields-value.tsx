import { useCallback } from 'react'
import { omit, pick, set } from 'lodash-es'
import { EditableSchemaTableCtxType } from '../ctx'

type UseGetFieldsValueCtxType<TData extends AnyObject> = {
  innerRef: React.MutableRefObject<EditableSchemaTableCtxType<TData>>
}

type GetFieldsValueExtraOptsType = {
  /** 额外需要获取的 fields */
  extraFields?: string[]
}

export function useGetFieldsValue<TData extends AnyObject = AnyObject>(
  ctx: UseGetFieldsValueCtxType<TData>
) {
  const { innerRef } = ctx

  return useCallback(
    function getFieldsValue<DataType extends AnyObject = Partial<TData>>(
      opts: GetFieldsValueExtraOptsType = {}
    ) {
      const { subscription, globalStaticRef } = innerRef.current
      const allValues = subscription.getValue()
      const keys = globalStaticRef.current.editableFieldKeys
      return allValues.map((row) => {
        const values = pick(row, keys)

        // 额外需要获取的 fields
        if (opts.extraFields?.length) {
          opts.extraFields.forEach((field) => {
            set(values, field, row[field])
          })
        }

        return values as DataType
      })
    },
    [innerRef]
  )
}

export function useGetGroupedValues<TData extends AnyObject = AnyObject>(
  ctx: UseGetFieldsValueCtxType<TData>
) {
  const { innerRef } = ctx

  return useCallback(
    function getGroupedValues() {
      const { subscription, globalStaticRef } = innerRef.current
      const allValues = subscription.getValue()
      const keys = globalStaticRef.current.editableFieldKeys // 可编辑字段
      return allValues.map((row) => {
        const editable = pick(row, keys) as Pick<TData, string>
        const readonly = omit(row, keys) as Omit<TData, string>
        return { editable, readonly }
      })
    },
    [innerRef] // innerRef
  )
}
