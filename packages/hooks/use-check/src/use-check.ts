import React, { useCallback } from 'react'
import { useLatestRef } from '@hi-ui/use-latest'
import { UseCheckItem } from './types'

/**
 * 用于多项选择的 hook
 */
export const useCheck = ({ disabled = false, checkedIds, onCheck, allowCheck }: UseCheckProps) => {
  const allowCheckRef = useLatestRef(allowCheck)

  const onNodeCheck = useCallback(
    (targetItem: UseCheckItem, shouldChecked: boolean) => {
      if (disabled) return
      if (allowCheckRef.current && allowCheckRef.current(targetItem) === false) return

      const nextCheckedIds = checkDefault(checkedIds, targetItem, shouldChecked)

      onCheck(nextCheckedIds, targetItem, shouldChecked)
    },
    [disabled, onCheck, allowCheckRef, checkedIds]
  )

  const isCheckedId = useCallback((id: React.ReactText) => checkedIds.indexOf(id) !== -1, [
    checkedIds,
  ])

  return [onNodeCheck, isCheckedId] as const
}

export interface UseCheckProps {
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
  onCheck: (checkedIds: React.ReactText[], targetItem: UseCheckItem, shouldChecked: boolean) => void
  /**
   * 返回 true 允许选中
   */
  allowCheck?: (targetItem: UseCheckItem) => boolean
}

/**
 * 普通多选
 */
export const checkDefault = <T extends UseCheckItem>(
  checkedIds: React.ReactText[],
  targetItem: T,
  shouldChecked: boolean
) => {
  let nextCheckedIds = checkedIds
  const targetId = targetItem.id

  if (shouldChecked) {
    if (nextCheckedIds.indexOf(targetId) === -1) {
      nextCheckedIds = nextCheckedIds.concat(targetId)
    }
  } else {
    nextCheckedIds = nextCheckedIds.filter((item) => item !== targetId)
  }

  return nextCheckedIds
}
