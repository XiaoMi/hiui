import React, { useCallback, useState } from 'react'
import { useSelect as useSelectDefault } from '@hi-ui/use-check'
import { CascaderItemEventData, FlattedCascaderItem } from '../types'
import { useLatestRef, useLatestCallback } from '@hi-ui/use-latest'
import { getNodeAncestors } from '../utils/index'

/**
 * 用于选中的 hook
 *
 * @param disabled
 * @returns
 */
export const useSelect = (
  disabled?: boolean,
  onSelectProp?: (
    value: React.ReactText,
    item: CascaderItemEventData,
    itemPaths: FlattedCascaderItem[]
  ) => void,
  changeOnSelect?: boolean,
  onLoadChildren: any,
  onSelect
) => {
  const onSelectLatest = useLatestCallback(onSelectProp)

  const [selectedId, setSelectedId] = useState<React.ReactText>('')

  const proxyOnSelect = useCallback(
    (selectedId: React.ReactText, selectOption: CascaderItemEventData) => {
      const optionPath = getNodeAncestors(selectOption)

      console.log('proxyOnSelect', optionPath)

      if (changeOnSelect) {
        // 任意选中
        onSelectLatest(selectedId, selectOption, optionPath)
      } else {
        // 选择末级
        const hasChildren = selectOption.children && selectOption.children.length > 0
        const canLoadChildren =
          hasChildren || (onLoadChildren && !selectOption.children && !selectOption.isLeaf)

        console.log('选择末级', selectOption, canLoadChildren)

        if (canLoadChildren) {
          return
        }
        onSelectLatest(selectedId, selectOption, optionPath)
      }

      // 关闭弹窗
      onSelect?.(selectedId, selectOption, optionPath)
    },
    [changeOnSelect, onLoadChildren, onSelectLatest, onSelect]
  )

  const onItemSelect = useCallback(
    (targetItem: CascaderItemEventData) => {
      if (disabled) return
      if (targetItem.disabled) return

      setSelectedId(targetItem.id)
      proxyOnSelect(targetItem.id, targetItem)
    },
    [disabled, proxyOnSelect]
  )

  return [selectedId, onItemSelect] as const
  // return useSelectDefault({
  //   disabled,
  //   defaultSelectedId,
  //   onSelect,
  //   // selectedId,
  //   allowSelect,
  // })
}

// const allowSelect = (item: any) => !item.Disabled
