import React from 'react'
import { cx } from '@hi-ui/classname'
import { flexRender } from '@tanstack/react-table'
import { mergeValues } from '@hi-ui/schema-utils'
import { useElHovering } from '@hi-ui/schema-hooks'
import type { Header, Table } from '@tanstack/react-table'
import { useEditableSchemaTableCtx } from '../ctx'
import { useTableContainer } from '../container/index'
import { getFixedStyles } from '../utils/fixed'
import { cls } from '../utils/cls'
import { validateHeaderCell } from './validate'

export type EditTableHeaderProps = {
  className?: string
}

type HeaderCellWrapperProps = {
  header: Header<AnyType, unknown>
  rowSpan?: number
  colSpan?: number
  fixed?: boolean
}

type HeaderCellWrapperDynamicAttrsCtxType = {
  header: Header<AnyType, unknown>
}

type HeaderCellWrapperDynamicAttrsType = React.ThHTMLAttributes<HTMLTableCellElement>

export type GetHeaderCellWrapperDynamicAttrsFnType = (
  ctx: HeaderCellWrapperDynamicAttrsCtxType
) => HeaderCellWrapperDynamicAttrsType

const HeaderCellWrapper = React.memo(function HeaderCell(props: HeaderCellWrapperProps) {
  const { header } = props
  const { table, globalStaticRef } = useEditableSchemaTableCtx()

  // 鼠标hover时，增加 data-hovering 状态
  const { elRef: headerCellRef } = useElHovering<HTMLTableCellElement>()

  const validation = validateHeaderCell(header, table.getHeaderGroups().length)
  if (!validation.isValid) return null

  // 开启 fixed 时才去获取固定单元格的样式
  const fixed = props.fixed ? getFixedStyles(header.column, { globalStaticRef }) : {}
  const fixedClassName = (fixed.className || []).map((c) => `cell--${c}`)

  // 获取动态属性
  const dynamicAttrs = header.column.columnDef.meta?.headerCell?.({ header })
  const style = mergeValues(
    fixed.style as React.CSSProperties,
    dynamicAttrs?.style as React.CSSProperties
  )

  return (
    <th
      {...dynamicAttrs}
      className={cx(
        cls(
          'header-cell',
          ...fixedClassName // fixed 样式
        ),
        dynamicAttrs?.className
      )}
      ref={headerCellRef}
      colSpan={dynamicAttrs?.colSpan ?? header.colSpan}
      rowSpan={dynamicAttrs?.rowSpan ?? validation.rowSpan}
      style={style}
      data-has-children={header.column.columnDef.meta?.field.children ? true : undefined}
      data-text-align={header.column.columnDef.meta?.align}
      data-field-name={header.column.columnDef.meta?.field?._titleText}
      data-field-key={header.column.columnDef.meta?.field?.dataIndex}
    >
      {flexRender(header.column.columnDef.header, header.getContext())}
    </th>
  )
})

export default React.memo(function Header({ className }: EditTableHeaderProps) {
  const { table } = useEditableSchemaTableCtx()
  const { virtualize } = useTableContainer()

  return (
    <thead className={cls('header', className)}>
      {table.getHeaderGroups().map((headerGroup) => {
        const realHeaders = headerGroup.headers
        const {
          left: leftHeaders,
          right: rightHeaders,
          center: centerHeaders,
        } = groupHeaders(realHeaders, table)

        return (
          <tr key={headerGroup.id} className={cls('header-row')}>
            {/* 左侧固定列 */}
            {leftHeaders.map((header) => (
              <HeaderCellWrapper key={header.id} header={header} fixed />
            ))}

            {/* 列虚拟化左侧padding */}
            {(virtualize?.colPadding?.left ?? 0) > 0 ? <th /> : null}

            {/* 中间可滚动列(支持虚拟化) */}
            {(virtualize?.columns || centerHeaders).map((headerOrVirtual) => {
              const header: typeof realHeaders[0] =
                'index' in headerOrVirtual ? realHeaders[headerOrVirtual.index] : headerOrVirtual
              if (!header) return null

              // 固定列不参与虚拟化
              if (header.column.getIsPinned()) return null

              return <HeaderCellWrapper key={header.id} header={header} />
            })}

            {/* 列虚拟化右侧padding */}
            {(virtualize?.colPadding?.right ?? 0) > 0 ? <th /> : null}

            {/* 右侧固定列 */}
            {rightHeaders.map((header) => (
              <HeaderCellWrapper key={header.id} header={header} fixed />
            ))}
          </tr>
        )
      })}
    </thead>
  )
})

export function groupHeaders(headers: Header<AnyType, unknown>[], table: Table<AnyType>) {
  const leftColumns = table.getLeftVisibleLeafColumns()
  const rightColumns = table.getRightVisibleLeafColumns()

  // 创建一个 Map 记录每列的位置类型
  const columnPositions = new Map<string, 'left' | 'right' | 'center'>()

  // 记录固定列的 id
  leftColumns.forEach((col) => columnPositions.set(col.id, 'left'))
  rightColumns.forEach((col) => columnPositions.set(col.id, 'right'))

  // 使用 reduce 一次遍历完成分组
  return headers.reduce(
    (groups, header) => {
      const position = columnPositions.get(header.column.id) || 'center'
      groups[position].push(header)
      return groups
    },
    {
      left: [] as typeof headers,
      center: [] as typeof headers,
      right: [] as typeof headers,
    }
  )
}
