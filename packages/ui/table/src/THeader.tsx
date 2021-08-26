import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { Checkbox } from '@hi-ui/checkbox'
import { __DEV__ } from '@hi-ui/env'
import { Column, RowSelection } from './Table'

const _role = 'table'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is THeader
 */
export const THeader = forwardRef<HTMLDivElement | null, THeaderProps>(
  ({ prefixCls = _prefix, columns, fixedColWidth, rowSelection }, ref) => {
    // TODO: 需要增加一下错误提示，比如rowSelection类型不合法等等
    const cls = cx(`${prefixCls}__header`)
    console.log('>>>>>>', fixedColWidth, fixedColWidth[1])

    return (
      <thead className={cls}>
        <tr>
          {rowSelection && (
            <th
              style={
                fixedColWidth && fixedColWidth.length > 0 ? { position: 'sticky', left: 0 } : {}
              }
            >
              <Checkbox />
            </th>
          )}
          {columns.map((c, idx) => (
            <th
              key={c.dataKey}
              data-key={
                c.dataKey +
                idx +
                '???' +
                (rowSelection ? fixedColWidth[idx + 1] : fixedColWidth[idx])
              }
              style={
                fixedColWidth[idx]
                  ? {
                      position: 'sticky',
                      // 列冻结计算，待优化
                      left:
                        idx === 0
                          ? rowSelection
                            ? fixedColWidth[0]
                            : 0
                          : rowSelection
                          ? fixedColWidth
                              .slice(0, idx + 1)
                              .reduce(function (accumulator, currentValue) {
                                return accumulator + currentValue
                              })
                          : fixedColWidth
                              .slice(0, idx)
                              .reduce(function (accumulator, currentValue) {
                                return accumulator + currentValue
                              }),
                    }
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
  rowSelection?: RowSelection
}

if (__DEV__) {
  THeader.displayName = 'THeader'
}
