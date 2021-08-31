import React, { forwardRef, useRef, useEffect, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TBody } from './TBody'
import { THeader } from './THeader'

const _role = 'table'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Table
 */
export const Table = forwardRef<HTMLDivElement | null, TableProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      columns = [],
      data = [],
      fixedToColumn,
      children,
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)
    const firstRowRef = useRef<HTMLTableRowElement>(null)
    const [fixedColWidth, setFixedColWidth] = useState<number[]>([])
    useEffect(() => {
      if (firstRowRef.current && fixedToColumn) {
        const fixedToIndex = columns.findIndex((c) => c.dataKey === fixedToColumn)
        const _fixedColsWidth = Array.from(firstRowRef.current.childNodes)
          .map((node) => {
            const _node = node as HTMLElement
            return _node.getBoundingClientRect().width
          })
          .slice(0, fixedToIndex + 1)
        setFixedColWidth(_fixedColsWidth)
      }
    }, [columns, data, fixedToColumn])

    return (
      <div className={`${prefixCls}__wrapper`}>
        <div className={`${prefixCls}--sticky ${prefixCls}`}>
          <table>
            <THeader columns={columns} prefixCls={prefixCls} fixedColWidth={fixedColWidth} />
            <TBody
              columns={columns}
              data={data}
              prefixCls={prefixCls}
              firstRowRef={firstRowRef}
              fixedColWidth={fixedColWidth}
            />
          </table>
        </div>
        <div ref={ref} role={role} className={cls}>
          <table>
            <THeader columns={columns} prefixCls={prefixCls} fixedColWidth={fixedColWidth} />
            <TBody
              columns={columns}
              data={data}
              prefixCls={prefixCls}
              firstRowRef={firstRowRef}
              fixedColWidth={fixedColWidth}
            />
          </table>
        </div>
      </div>
    )
  }
)

export interface TableProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 组件的注入样式
   */
  style?: React.CSSProperties
  /**
   * 列配置项
   */
  columns?: Column[]
  /**
   * 数据配置项
   */
  data?: object[]
  /**
   * 冻结列
   */
  fixedToColumn?: string
}

if (__DEV__) {
  Table.displayName = 'Table'
}

export interface Column {
  title: React.ReactNode
  dataKey: string
}

export interface FixedOption {
  left?: string
  right?: string
}
