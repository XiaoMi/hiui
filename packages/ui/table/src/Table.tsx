import React, { forwardRef } from 'react'
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
    { prefixCls = _prefix, role = _role, className, columns = [], data = [], children, ...rest },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <table>
          <THeader columns={columns} prefixCls={prefixCls} />
          <TBody columns={columns} data={data} prefixCls={prefixCls} />
        </table>
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
}

if (__DEV__) {
  Table.displayName = 'Table'
}

export interface Column {
  title: React.ReactNode
  dataKey: string
}
