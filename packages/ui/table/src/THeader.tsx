import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { Column } from './Table'

const _role = 'table'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is THeader
 */
export const THeader = forwardRef<HTMLDivElement | null, THeaderProps>(
  ({ prefixCls = _prefix, columns, fixedColWidth }, ref) => {
    const cls = cx(`${prefixCls}__header`)

    return (
      <thead className={cls}>
        <tr>
          {columns.map((c, idx) => (
            <th
              key={c.dataKey}
              style={
                fixedColWidth[idx]
                  ? { position: 'sticky', left: idx === 0 ? 0 : fixedColWidth[idx - 1] }
                  : {}
              }
            >
              {c.title}
            </th>
          ))}
        </tr>
      </thead>
    )
  }
)

export interface THeaderProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 列配置项
   */
  columns: Column[]
  fixedColWidth: number[]
}

if (__DEV__) {
  THeader.displayName = 'THeader'
}
