import React from 'react'
import { cx } from '@hi-ui/classname'
import { flexRender } from '@tanstack/react-table'
import { mergeValues } from '@hi-ui/schema-utils'
import type { Cell, Row } from '@tanstack/react-table'
import type { FieldControlType } from '@hi-ui/schema-core'
import { useEditableSchemaTableCtx } from '../ctx'
import { RowExpandingWrapper } from '../features/row-expanding/wrapper'
import { getFixedStyles } from '../utils/fixed'
import { cls } from '../utils/cls'

type BodyCellWrapperProps = {
  cell: Cell<AnyType, unknown>
  fixed?: boolean
}

type BodyCellWrapperDynamicAttrsCtxType = {
  cell: Cell<AnyType, unknown>
  row: Row<AnyType>
  rowData: AnyObject
  renderCase: BodyCellRenderCaseType
}

type BodyCellWrapperDynamicAttrsType = React.TdHTMLAttributes<HTMLTableCellElement>

export type GetBodyCellWrapperDynamicAttrsFnType = (
  ctx: BodyCellWrapperDynamicAttrsCtxType
) => BodyCellWrapperDynamicAttrsType

// NOTE 此处注释：适配【行展开功能】时留
// 识别到此处包装器如果打开 memo，会导致【外部命令式设置行展开状态】时，icon 的状态会展示错误
// 原因在于，此处包装器会隔离外部设置状态后引发的重渲染，导致下面的 RowExpandingWrapper 无法重渲染
// 最初增加 memo 的目的是提升渲染性能，此处移除时经评估和实测后并不会引起突出的损耗
// 因此决定暂时移除 memo，后续如果引起问题再重新考虑使用订阅的方式触发下层组件重渲染
// export const BodyCellWrapper2 = React.memo(function BodyCellWrapper(props) {
//   return <>留一个占位</>
// })
export function BodyCellWrapper(props: BodyCellWrapperProps) {
  const { cell } = props
  const { globalStaticRef } = useEditableSchemaTableCtx()

  // 开启 fixed 时才去获取固定单元格的样式
  const fixed = props.fixed ? getFixedStyles(cell.column, { globalStaticRef }) : {}
  const fixedClassName = (fixed.className || []).map((c) => `cell--${c}`)

  const renderCase = useRenderCase()
  const renderCaseMap = {
    basic: BasicEl,
    expanding: ExpandingEl,
    grouping: GroupingEl,
  }
  const CaseEl = renderCaseMap[renderCase]

  // 获取动态属性
  const dynamicAttrs = cell.column.columnDef.meta?.bodyCell?.({
    cell,
    row: cell.row,
    rowData: cell.row.$getRealtimeRowData() || {},
    renderCase,
  })
  const style = mergeValues(fixed.style, dynamicAttrs?.style)

  const textAlign = cell.column.columnDef.meta?.align
  return (
    <td
      {...dynamicAttrs}
      className={cx(
        cls(
          'body-cell',
          ...fixedClassName // fixed 样式
        ),
        dynamicAttrs?.className
      )}
      style={style}
      data-text-align={textAlign}
      data-id={cell.id} // 行/列的实例均可通过 cellId 获取单元格实例后获取
    >
      <CaseEl renderCase={renderCase} cell={cell} textAlign={textAlign} />
    </td>
  )
}

export type BodyCellRenderCaseType = ReturnType<typeof useRenderCase>

function useRenderCase() {
  const { globalStaticRef } = useEditableSchemaTableCtx()
  const { enableRowExpanding, enableRowGrouping } = globalStaticRef.current

  if (enableRowGrouping) return 'grouping'
  if (enableRowExpanding) return 'expanding'

  return 'basic'
}

type InnerElProps = Pick<BodyCellWrapperProps, 'cell'> & {
  textAlign: FieldControlType['align']
  renderCase: BodyCellRenderCaseType
}

// 普通基本元素
function BasicEl(props: InnerElProps) {
  const { cell } = props
  return <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>
}

// 可展开元素
function ExpandingEl(props: InnerElProps) {
  const { cell, textAlign } = props

  return (
    <RowExpandingWrapper renderCase={props.renderCase} cell={cell} textAlign={textAlign}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </RowExpandingWrapper>
  )
}

function GroupingEl(props: InnerElProps) {
  const { cell, textAlign } = props

  const cellIndex = cell.column.getIndex()

  /** 是否聚合单元格 */
  const isAggregated = cell.getIsAggregated()
  /** 是否无效的聚合单元格 */
  // || undefined 是为了放在data-*属性上时 false 时不会显示
  const isInvalidAggregatedCell = (isAggregated && cellIndex !== 0) || undefined

  /** 是否分组单元格 */
  const isGrouped = cell.getIsGrouped()

  // 当前行时分组行，且当前单元格是 placeholder 单元格，则不渲染
  /** 是否当前行是分组行 */
  const isRowGrouped = cell.row.getIsGrouped()
  /** 是否当前单元格是 placeholder 单元格 */
  const isPlaceholder = cell.getIsPlaceholder()

  const hideRealEl =
    // 无效的聚合单元格
    isInvalidAggregatedCell ||
    // 分组单元格
    isGrouped ||
    // 当前行是分组行，且当前单元格是 placeholder 单元格
    (isRowGrouped && isPlaceholder)

  return (
    <>
      {hideRealEl ? null : (
        <RowExpandingWrapper renderCase={props.renderCase} cell={cell} textAlign={textAlign}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </RowExpandingWrapper>
      )}
    </>
  )
}
