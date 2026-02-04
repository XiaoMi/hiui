import { produce } from 'immer'
import { set } from 'lodash-es'
import type { FormListChildrenAction } from '@hi-ui/form'
import { Schedular } from '@hi-ui/schema-utils'
import type { SchemaFormCtxType } from '../ctx'

export type PatchFormListActionsCtx = {
  dataIndex: string
  actions: FormListChildrenAction
  formRef: SchemaFormCtxType['formRef']
  handleValuesChangeRef: SchemaFormCtxType['handleValuesChangeRef']
}

export type PatchedFormListActions = FormListChildrenAction & {
  handleItemsChange: (nextValue: AnyArray) => void
}

export function patchFormListActions(ctx: PatchFormListActionsCtx) {
  const { actions: originalActions } = ctx

  function getFieldValue() {
    return (ctx.formRef.current?.getFieldValue(ctx.dataIndex) || []) as AnyArray
  }

  function handleItemsChange(nextValue: AnyArray) {
    // 先写到表单绑定上
    ctx.formRef.current?.setFieldValue(ctx.dataIndex, nextValue)

    // 再使用微任务来触发表单的值变化
    Schedular.nextMicro(() => {
      const allValues = ctx.formRef.current?.getFieldsValue() || {}
      const changedValues = set({}, ctx.dataIndex, nextValue)
      ctx.handleValuesChangeRef.current?.(changedValues, allValues)
    })
  }

  function add(value: unknown) {
    originalActions.add(value)

    try {
      const fieldValue = getFieldValue()
      const producedValue = produce(fieldValue, (draft) => {
        draft.push(value)
      })
      const nextValue = producedValue
      handleItemsChange(nextValue)
    } catch (error) {
      console.log('patchFormListActions add', error)
    }
  }

  function remove(index: number) {
    originalActions.remove(index)

    try {
      const fieldValue = getFieldValue()
      const producedValue = fieldValue.filter((_, idx) => idx !== index)
      const nextValue = producedValue
      handleItemsChange(nextValue)
    } catch (error) {
      console.log('patchFormListActions remove', error)
    }
  }

  // TODO 此处下面这些个 index 其实有可能会越界，需要处理
  // 但是读HiUI的源码，发现也没做这个检查，因此暂时不处理

  function swap(aIndex: number, bIndex: number) {
    originalActions.swap(aIndex, bIndex)

    try {
      const fieldValue = getFieldValue()
      const producedValue = produce(fieldValue, (draft) => {
        const temp = draft[aIndex]
        draft[aIndex] = draft[bIndex]
        draft[bIndex] = temp
      })
      const nextValue = producedValue
      handleItemsChange(nextValue)
    } catch (error) {
      console.log('patchFormListActions swap', error)
    }
  }

  function insertBefore(index: number, value: unknown) {
    // 插入前的处理逻辑
    originalActions.insertBefore(index, value)
    // 插入后的处理逻辑

    try {
      const fieldValue = getFieldValue()
      const producedValue = produce(fieldValue, (draft) => {
        draft.splice(index, 0, value)
      })
      const nextValue = producedValue
      handleItemsChange(nextValue)
    } catch (error) {
      console.log('patchFormListActions insertBefore', error)
    }
  }

  function move(fromIndex: number, toIndex: number) {
    originalActions.move(fromIndex, toIndex)

    try {
      const fieldValue = getFieldValue()
      const producedValue = produce(fieldValue, (draft) => {
        const temp = draft[fromIndex]
        draft.splice(fromIndex, 1) // 先把之前的删除
        draft.splice(toIndex, 0, temp) // 再把之前的插入到新的位置
      })
      const nextValue = producedValue
      handleItemsChange(nextValue)
    } catch (error) {
      console.log('patchFormListActions move', error)
    }
  }

  return { add, remove, swap, insertBefore, move, handleItemsChange }
}
