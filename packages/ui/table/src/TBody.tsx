import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { Column } from './Table'

const _role = 'table'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is TBody
 */
export const TBody = forwardRef<HTMLDivElement | null, TBodyProps>(
  ({ prefixCls = _prefix, data, columns, firstRowRef, fixedColWidth }, ref) => {
    const cls = cx(`${prefixCls}__body`)

    return (
      <tbody className={cls}>
        {data.map((d, index) => (
          <tr
            key={Math.random()}
            className={`${prefixCls}__row`}
            ref={index === 0 ? firstRowRef : null}
          >
            {columns.map((c, idx) => (
              <td
                key={c.dataKey}
                style={
                  fixedColWidth[idx]
                    ? { position: 'sticky', left: idx === 0 ? 0 : fixedColWidth[idx - 1] }
                    : {}
                }
              >
                {d[c.dataKey]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    )
  }
)

export interface TBodyProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 列配置项
   */
  columns: Column[]
  /**
   * 数据配置项
   */
  data: object[]
  /**
   * 第一行ref
   */
  firstRowRef: React.RefObject<HTMLTableRowElement>
  fixedColWidth: number[]
}

if (__DEV__) {
  TBody.displayName = 'TBody'
}
