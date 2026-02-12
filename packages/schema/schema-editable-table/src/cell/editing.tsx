import React from 'react'
import { useMemoizedFn, useUpdate } from 'ahooks'
import { isFunction, isObjectLike } from 'lodash-es'
import type { CellContext } from '@tanstack/react-table'
import { Schedular } from '@hi-ui/schema-utils'
import { useEditTableCtx } from '../ctx'

export function useEditingCellFormBinding<TData extends AnyObject>(
  props: CellContext<TData, unknown>
) {
  const {
    getValue,
    row: { index },
    column: { id },
    table,
  } = props
  const { globalStaticRef } = useEditTableCtx()
  const enableRowEdit = globalStaticRef.current.enableRowEdit

  const initialValue = getValue()
  const valueRef = React.useRef(initialValue)
  valueRef.current = table.options.meta?.getCellValue(index, id)

  const forceUpdate = useUpdate()
  const updateValue = useMemoizedFn(
    (nextValue: unknown) => {
      table.options.meta?.updateData(index, id, nextValue)

      // 行编辑模式下，强制更新
      if (enableRowEdit) forceUpdate()
    }
    // 移除了此处的防抖函数，原因有2
    // 1. useDebounceFn 内部会在组件卸载时取消，导致 updateValue 失效，无法更新值
    // 2. 大部分内置组件已在更上游处理防抖逻辑，此处没有必要再额外处理了
  )

  const handleChange = (eventOrValue: unknown) => {
    const nextValue = normalizeValueFromChange(eventOrValue)
    valueRef.current = nextValue
    updateValue(nextValue)
  }

  const handleBlur = () => {
    // 行编辑模式下，失焦时保持激活状态，不更新值
    if (enableRowEdit) return

    // 延迟一小会儿再更新值
    Schedular.nextMicro(() => {
      updateValue(valueRef.current)
    })
  }

  return {
    // NOTE 此处value已被废弃，会在外部由真实的值覆盖
    value: valueRef.current,
    onChange: handleChange,
    onBlur: handleBlur,
    invalid: undefined,
  }
}

// fork from https://github.com/XiaoMi/hiui/blob/master/packages/ui/form/src/use-form.ts#L303
export function normalizeValueFromChange(eventOrValue: unknown) {
  if (!isObjectLike(eventOrValue) || !(eventOrValue as AnyObject).target) {
    return eventOrValue
  }

  const event = eventOrValue as React.ChangeEvent<AnyObject>

  // @see https://reactjs.org/docs/events.html#event-pooling
  if (isFunction(event.persist)) {
    event.persist()
  }

  const target = event.target || event.currentTarget

  // 待验证 // 待支持更多类型
  if (target.type === 'checkbox') return target.checked
  if (target.type === 'radio') return target.checked

  return target.value
}
