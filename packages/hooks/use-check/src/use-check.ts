import React, { useCallback } from 'react'
import { useLatestRef } from '@hi-ui/use-latest'
import { UseCheckItem } from './types'

/**
 * 用于多项选择的 hook
 */
export const useCheck = ({
  disabled = false,
  checkedIds,
  onCheck,
  allowCheck,
  idFieldName = 'id',
}: UseCheckProps) => {
  const allowCheckRef = useLatestRef(allowCheck)
  const checkedIdsLatestRef = useLatestRef(checkedIds)

  const onNodeCheck = useCallback(
    (targetItem: UseCheckItem, shouldChecked: boolean) => {
      if (disabled) return
      if (allowCheckRef.current && allowCheckRef.current(targetItem) === false) return

      const checkedIds = checkedIdsLatestRef.current
      const nextCheckedIds = checkDefault(checkedIds, targetItem, shouldChecked, idFieldName)

      onCheck(nextCheckedIds, targetItem, shouldChecked)
    },
    [disabled, onCheck, allowCheckRef, checkedIdsLatestRef, idFieldName]
  )

  const isCheckedId = useCallback((id: React.ReactText) => checkedIds.indexOf(id) !== -1, [
    checkedIds,
  ])

  return [onNodeCheck, isCheckedId] as const
}

export interface UseCheckProps<T extends UseCheckItem = any> {
  /**
   * 开启禁用选择
   */
  disabled?: boolean
  /**
   * 选中的 ids（受控）
   */
  checkedIds: React.ReactText[]
  /**
   * 选择时回调
   */
  onCheck: (checkedIds: React.ReactText[], targetItem: T, shouldChecked: boolean) => void
  /**
   * 返回 true 允许选中
   */
  allowCheck?: (targetItem: T) => boolean
  /**
   * id 映射的字段
   */
  idFieldName?: string
}

/**
 * 普通多选
 */
export const checkDefault = <T extends UseCheckItem>(
  checkedIds: React.ReactText[],
  targetItem: T,
  shouldChecked: boolean,
  idFieldName: string
) => {
  let nextCheckedIds = checkedIds
  const targetId = targetItem[idFieldName]

  if (shouldChecked) {
    if (nextCheckedIds.indexOf(targetId) === -1) {
      nextCheckedIds = nextCheckedIds.concat(targetId)
    }
  } else {
    nextCheckedIds = nextCheckedIds.filter((item) => item !== targetId)
  }

  return nextCheckedIds
}
