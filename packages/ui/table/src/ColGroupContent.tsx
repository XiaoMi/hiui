import React, { forwardRef } from 'react'
import { getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useTableContext } from './context'
import { FlattedTableColumnItemData } from '.'
import { GlobalConfig } from '@hi-ui/core'

const _prefix = getPrefixCls('table-colgroup')

export const ColGroupContent = forwardRef<HTMLTableColElement | null, TableColgroupProps>(
  ({ prefixCls: prefixClsProp }, ref) => {
    const globalPrefixCls = GlobalConfig.prefixCls
    const prefixCls =
      prefixClsProp ||
      (globalPrefixCls && getPrefixCls('table-colgroup', globalPrefixCls)) ||
      _prefix

    const { getColgroupProps, leafColumns } = useTableContext()

    return (
      <colgroup>
        {leafColumns.map((col, idx) => {
          return (
            <col
              key={idx}
              className={`${prefixCls}-col`}
              {...getColgroupProps(col as FlattedTableColumnItemData, idx)}
            />
          )
        })}
      </colgroup>
    )
  }
)

export interface TableColgroupProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
}

if (__DEV__) {
  ColGroupContent.displayName = 'ColGroupContent'
}
