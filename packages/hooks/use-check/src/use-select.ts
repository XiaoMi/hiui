import React, { useCallback } from 'react'
import { useLatestRef } from '@hi-ui/use-latest'
import { UseCheckItem } from './types'

const NOOP_ID = ''

/**
 * 用于单项选择的 hook
 */
export const useSelect = ({
  disabled = false,
  selectedId,
  onSelect,
  allowSelect,
}: UseSelectProps) => {
  const allowSelectRef = useLatestRef(allowSelect)

  const onItemSelect = useCallback(
    <T extends UseCheckItem>(targetItem: T, shouldSelected: boolean = true) => {
      if (disabled) return
      if (allowSelectRef.current && allowSelectRef.current(targetItem) === false) return

      if (shouldSelected) {
        onSelect(targetItem.id, targetItem, true)
      } else {
        onSelect(NOOP_ID)
      }
    },
    [disabled, allowSelectRef, onSelect]
  )

  const isSelectedId = useCallback((id: React.ReactText) => id !== '' && selectedId === id, [
    selectedId,
  ])

  return [onItemSelect, isSelectedId] as const
}

export interface UseSelectProps<T extends UseCheckItem = any> {
  /**
   * 开启禁用选择
   */
  disabled?: boolean
  /**
   * 选中的 id（受控）
   */
  selectedId: React.ReactText
  /**
   * 选择时回调
   */
  onSelect: (selectedId: React.ReactText, targetItem?: T, shouldSelected?: boolean) => void
  /**
   * 返回 true 允许选中
   */
  allowSelect?: (targetItem: T) => boolean
}
