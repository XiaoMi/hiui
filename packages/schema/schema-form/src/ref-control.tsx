import React, { useCallback, useEffect } from 'react'
import { useLatest, useUpdate } from 'ahooks'
import { useReadonlyRef } from '@hi-ui/schema-hooks'
import { Subscription } from '@hi-ui/use-subscription'
import { mergeProps } from '@hi-ui/schema-utils'
import { useSchemaFormCtx } from './ctx'
import { normalizeDataIndex, type DataIndexType } from './_utils'
import type { FormItemProps } from './type'

// 字段控制状态类型定义
export type FieldControlState<TFieldProps extends AnyObject = AnyObject> = {
  /** 字段是否隐藏 */
  hidden?: boolean
  /** 字段是否必填 */
  required?: boolean
  /** 字段是否禁用 */
  disabled?: boolean
  /** 字段是否只读 */
  readonly?: boolean
  /** 自定义字段属性 */
  fieldProps?: TFieldProps
  /** 自定义表单项属性 */
  formItemProps?: FormItemProps
}

// FormControl 状态更新事件类型
export type FormControlStateChange = {
  type: 'fieldState' | 'batchState' | 'reset' | 'resetAll'
  payload: {
    fieldKey?: string
    fieldKeys?: string[]
    state?: FieldControlState
    states?: Record<string, FieldControlState>
  }
}

export type FormControlType = {
  /** 设置字段显隐状态 */
  setFieldHidden: (fieldKey: DataIndexType, hidden: boolean) => void
  /** 设置字段必填状态 */
  setFieldRequired: (fieldKey: DataIndexType, required: boolean) => void
  /** 设置字段禁用状态 */
  setFieldDisabled: (fieldKey: DataIndexType, disabled: boolean) => void
  /** 设置字段只读状态 */
  setFieldReadonly: (fieldKey: DataIndexType, readonly: boolean) => void
  /** 设置字段完整状态 */
  setFieldState: <TFieldProps extends AnyObject>(
    fieldKey: DataIndexType,
    state: Partial<FieldControlState<TFieldProps>>
  ) => void
  /** 批量设置多个字段状态 */
  setFieldsState: <TFieldProps extends AnyObject>(
    updates: Record<string, Partial<FieldControlState<TFieldProps>>>
  ) => void
  /** 获取字段当前控制状态 */
  getFieldState: (fieldKey: DataIndexType) => FieldControlState | undefined
  /** 获取所有字段控制状态 */
  getAllFieldsState: () => Map<string, FieldControlState>
  /** 重置单个字段控制状态 */
  resetFieldState: (fieldKey: DataIndexType) => void
  /** 重置所有字段控制状态 */
  resetAllFieldsState: () => void
  /** 隐藏字段的便捷方法 */
  hideField: (fieldKey: DataIndexType) => void
  /** 显示字段的便捷方法 */
  showField: (fieldKey: DataIndexType) => void
  /** 订阅状态变化 */
  subscribe: (callback: (change: FormControlStateChange) => void) => () => void
}

export type FormControlRefType = React.RefObject<FormControlType>

/** 将 DataIndexType 转换为字符串键，用于 Map 存储 */
function normalizeFieldKey(fieldKey: DataIndexType): string {
  return normalizeDataIndex(fieldKey).join('.')
}

export function useFormControlRef() {
  return useReadonlyRef(function generateFormControlRef(): FormControlType {
    // 字段控制状态存储
    const fieldsStateMap = new Map<string, FieldControlState>()

    // 创建订阅管理器
    const subscription = new Subscription<FormControlStateChange>({} as FormControlStateChange)

    // 通知状态变化的辅助函数
    const notifyChange = (change: FormControlStateChange) => {
      subscription.setValue(change)
    }

    // 合并字段状态的辅助函数
    const mergeFieldState = (fieldKey: DataIndexType, newState: Partial<FieldControlState>) => {
      const normalizedKey = normalizeFieldKey(fieldKey)
      const currentState = fieldsStateMap.get(normalizedKey) || {}
      const mergedState = mergeProps(currentState, newState)

      // 清理 undefined 值
      Object.keys(mergedState).forEach((key) => {
        if (mergedState[key as keyof FieldControlState] === undefined) {
          delete mergedState[key as keyof FieldControlState]
        }
      })

      if (Object.keys(mergedState).length === 0) {
        fieldsStateMap.delete(normalizedKey)
      } else {
        fieldsStateMap.set(normalizedKey, mergedState)
      }

      return { nextKey: normalizedKey, nextState: mergedState }
    }

    return {
      setFieldHidden: (fieldKey: DataIndexType, hidden: boolean) => {
        const { nextKey, nextState: state } = mergeFieldState(fieldKey, { hidden })
        notifyChange({ type: 'fieldState', payload: { fieldKey: nextKey, state } })
      },

      setFieldRequired: (fieldKey: DataIndexType, required: boolean) => {
        const { nextKey, nextState: state } = mergeFieldState(fieldKey, { required })
        notifyChange({ type: 'fieldState', payload: { fieldKey: nextKey, state } })
      },

      setFieldDisabled: (fieldKey: DataIndexType, disabled: boolean) => {
        const { nextKey, nextState: state } = mergeFieldState(fieldKey, { disabled })
        notifyChange({ type: 'fieldState', payload: { fieldKey: nextKey, state } })
      },

      setFieldReadonly: (fieldKey: DataIndexType, readonly: boolean) => {
        const { nextKey, nextState: state } = mergeFieldState(fieldKey, { readonly })
        notifyChange({ type: 'fieldState', payload: { fieldKey: nextKey, state } })
      },

      setFieldState: (fieldKey: DataIndexType, newState: Partial<FieldControlState>) => {
        const { nextKey, nextState: state } = mergeFieldState(fieldKey, newState)
        notifyChange({ type: 'fieldState', payload: { fieldKey: nextKey, state } })
      },

      setFieldsState: (updates: Record<string, Partial<FieldControlState>>) => {
        const updatedStates: Record<string, FieldControlState> = {}
        const fieldKeys: string[] = []

        Object.entries(updates).forEach(([fieldKeyStr, newState]) => {
          // 这里的 fieldKeyStr 已经是字符串形式的 key
          const { nextKey, nextState } = mergeFieldState(fieldKeyStr, newState)
          updatedStates[nextKey] = nextState
          fieldKeys.push(nextKey)
        })

        notifyChange({ type: 'batchState', payload: { fieldKeys, states: updatedStates } })
      },

      getFieldState: (fieldKey: DataIndexType) => {
        const normalizedKey = normalizeFieldKey(fieldKey)
        return fieldsStateMap.get(normalizedKey)
      },

      getAllFieldsState: () => {
        return new Map(fieldsStateMap)
      },

      resetFieldState: (fieldKey: DataIndexType) => {
        const normalizedKey = normalizeFieldKey(fieldKey)
        fieldsStateMap.delete(normalizedKey)
        notifyChange({ type: 'reset', payload: { fieldKey: normalizedKey } })
      },

      resetAllFieldsState: () => {
        fieldsStateMap.clear()
        notifyChange({ type: 'resetAll', payload: {} })
      },

      hideField: (fieldKey: DataIndexType) => {
        const { nextKey, nextState: state } = mergeFieldState(fieldKey, { hidden: true })
        notifyChange({ type: 'fieldState', payload: { fieldKey: nextKey, state } })
      },

      showField: (fieldKey: DataIndexType) => {
        const { nextKey, nextState: state } = mergeFieldState(fieldKey, { hidden: false })
        notifyChange({ type: 'fieldState', payload: { fieldKey: nextKey, state } })
      },

      subscribe: (callback: (change: FormControlStateChange) => void) => {
        return subscription.subscribe((event) => {
          callback(event.value)
        })
      },
    }
  })
}

/**
 * 用于在字段渲染时获取FormControl状态的Hook
 * @param formControlRef FormControl引用
 * @param fieldsKeys 需要监听的字段key列表
 */
export function useFormControlState(fieldsKeys: DataIndexType[]) {
  const { controlRef: formControlRef } = useSchemaFormCtx()

  const stateMapRef = useReadonlyRef(() => new Map<string, FieldControlState>())
  const forceUpdate = useUpdate()

  // 将 fieldsKeys 标准化为字符串数组，便于比较
  const normalizedFieldsKeysRef = useLatest(fieldsKeys.map(normalizeFieldKey))

  // 订阅 FormControl 状态变化
  useEffect(() => {
    if (!formControlRef.current) return

    const normalizedFieldsKeys = normalizedFieldsKeysRef.current
    if (!normalizedFieldsKeys) return

    return formControlRef.current.subscribe((change) => {
      const { type, payload } = change
      let shouldUpdate = false

      switch (type) {
        case 'fieldState':
          if (payload.fieldKey) {
            const normalizedKey = payload.fieldKey
            if (normalizedFieldsKeys.includes(normalizedKey)) {
              if (payload.state && Object.keys(payload.state).length > 0) {
                stateMapRef.current.set(normalizedKey, payload.state)
              } else {
                stateMapRef.current.delete(normalizedKey)
              }
              shouldUpdate = true
            }
          }
          break

        case 'batchState':
          if (payload.fieldKeys?.some((key) => normalizedFieldsKeys.includes(key))) {
            payload.fieldKeys.forEach((normalizedKey) => {
              if (normalizedFieldsKeys.includes(normalizedKey) && payload.states?.[normalizedKey]) {
                stateMapRef.current.set(normalizedKey, payload.states[normalizedKey])
              }
            })
            shouldUpdate = true
          }
          break

        case 'reset':
          if (payload.fieldKey) {
            const normalizedKey = payload.fieldKey
            if (normalizedFieldsKeys.includes(normalizedKey)) {
              stateMapRef.current.delete(normalizedKey)
              shouldUpdate = true
            }
          }
          break

        case 'resetAll':
          stateMapRef.current.clear()
          shouldUpdate = true
          break
      }

      if (shouldUpdate) forceUpdate()
    })
  }, [formControlRef, stateMapRef, normalizedFieldsKeysRef, forceUpdate])

  // 获取字段控制状态
  const getFieldControlState = useCallback(
    function getFieldControlState(fieldKey: DataIndexType) {
      const normalizedKey = normalizeFieldKey(fieldKey)
      return stateMapRef.current.get(normalizedKey)
    },
    [stateMapRef]
  )

  return { getFieldControlState }
}
