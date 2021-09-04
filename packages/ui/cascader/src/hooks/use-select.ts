import React from 'react'
import { useSelect as useSelectDefault } from '@hi-ui/use-check'
import { CascaderItemEventData } from '../types'

/**
 * 用于选中的 hook
 *
 * @param disabled
 * @returns
 */
export const useSelect = (
  disabled?: boolean,
  defaultSelectedId?: React.ReactText,
  // selectedId?: React.ReactText,
  onSelect?: (value: React.ReactText, item: CascaderItemEventData) => void
) => {
  return useSelectDefault({
    disabled,
    defaultSelectedId,
    onSelect,
    // selectedId,
    allowSelect,
  })
}

const allowSelect = (item: any) => !item.Disabled
