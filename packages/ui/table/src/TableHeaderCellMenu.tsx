import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useTableContext } from './context'

const _prefix = getPrefixCls('table-cell')

/**
 * TODO: What is TableHeaderCellMenu
 */
export const TableHeaderCellMenu = forwardRef<HTMLDivElement | null, TableHeaderCellPropsMenu>(
  ({ prefixCls = _prefix, className }, ref) => {
    const { canScroll, isTree } = useTableContext()

    return <div></div>
  }
)

export interface TableHeaderCellPropsMenu {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
}

if (__DEV__) {
  TableHeaderCellMenu.displayName = 'TableHeaderCellMenu'
}
