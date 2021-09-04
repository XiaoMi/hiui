import React, { useCallback } from 'react'
import { useLatestRef } from '@hi-ui/use-latest'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { UseCheckItem } from './types'

const NOOP_ID = ''

/**
 * 用于单项选择的 hook
 */
export const useSelect = ({
  disabled = false,
  defaultSelectedId = NOOP_ID,
  selectedId: selectedIdProp,
  onSelect: onSelectProp,
  allowSelect,
  preventUpdate,
}: UseSelectProps) => {
  const onSelectRef = useLatestRef(onSelectProp)

  const proxyOnSelect = useCallback(
    (id: React.ReactText, item?: UseCheckItem, shouldSelected?: boolean) => {
      onSelectRef.current?.(id, item, shouldSelected)
    },
    [onSelectRef]
  )

  const [selectedId, setSelectedId] = useUncontrolledState(
    defaultSelectedId,
    selectedIdProp,
    proxyOnSelect,
    () => false
  )

  const allowSelectRef = useLatestRef(allowSelect)

  const onItemSelect = useCallback(
    (targetItem: UseCheckItem, shouldSelected: boolean = true) => {
      if (disabled) return
      if (allowSelectRef.current && allowSelectRef.current(targetItem) === false) return

      if (shouldSelected) {
        setSelectedId(targetItem.id, targetItem, true)
      } else {
        setSelectedId(NOOP_ID)
      }
    },
    [disabled, allowSelectRef, setSelectedId]
  )

  return [selectedId, onItemSelect] as const
}

export interface UseSelectProps<T extends UseCheckItem = any> {
  /**
   * 开启禁用选择
   */
  disabled?: boolean
  /**
   * 非受控默认选中 id
   */
  defaultSelectedId?: React.ReactText
  /**
   * 选中的 id
   */
  selectedId?: React.ReactText
  /**
   * 选择时回调
   */
  onSelect?: (selectedId: React.ReactText, targetItem: T, shouldSelected?: boolean) => void
  /**
   * 返回 true 允许选中
   */
  allowSelect?: (targetItem: T) => boolean
  preventUpdate: (prev: any, next: any) => boolean
}
