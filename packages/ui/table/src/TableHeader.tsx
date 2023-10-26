import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useTableContext } from './context'
import { ColGroupContent } from './ColGroupContent'
import { TheadContent } from './TheadContent'

const _prefix = getPrefixCls('table-header')

export const TableHeader = forwardRef<HTMLDivElement | null, TableHeaderProps>(
  ({ prefixCls = _prefix, className }, ref) => {
    const { onTableBodyScrollMock, scrollHeaderElementRef, getTableHeaderProps } = useTableContext()

    const cls = cx(prefixCls, className)

    return (
      <div className={cls} ref={scrollHeaderElementRef} {...getTableHeaderProps()}>
        {/* header 内置 table，利用 table colgroup 特性，实现单独表头的分组 */}
        <table style={{ width: '100%', position: 'relative' }}>
          <ColGroupContent />
          <TheadContent onWheel={onTableBodyScrollMock} />
        </table>
      </div>
    )
  }
)

export interface TableHeaderProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  className?: string
}

if (__DEV__) {
  TableHeader.displayName = 'TableHeader'
}
