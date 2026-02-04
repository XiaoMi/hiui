import React from 'react'
import { useUpdate } from 'ahooks'
import { CaretRightFilled } from '@hi-ui/icons'
import { flexRender } from '@tanstack/react-table'
import type { Cell } from '@tanstack/react-table'
import type { FieldControlType } from '@hi-ui/schema-core'
import { cls as parentCls } from '../../utils/cls'
import type { BodyCellRenderCaseType } from '../../body/wrapper'

type RowExpandingWrapperProps = {
  cell: Cell<AnyType, unknown> // 不关心数据类型
  textAlign?: FieldControlType['align']
  renderCase: BodyCellRenderCaseType
}

const cls = (el?: string) => parentCls('body-cell_expanding' + (el ? `-${el}` : ''))
const INDENT_VAR_NAME = '--editable-schema-table-body-cell-expanding-indent'

export function RowExpandingWrapper(props: React.PropsWithChildren<RowExpandingWrapperProps>) {
  const { cell } = props
  const { row } = cell

  const isExpanded = row.getIsExpanded()

  const forceUpdate = useUpdate()
  function handleExpandClick() {
    const innerHandler = row.getToggleExpandedHandler()
    innerHandler()
    forceUpdate()
  }

  if (cell.column.getIndex() !== 0) return <>{props.children}</>

  // 末端行的的缩进级别需要加1
  // 因为没有前面的折叠按钮了，视觉上缩进会少一点点
  const indentLevel = row.depth + (row.subRows?.length ? 0 : 1)

  const isAggregated = cell.getIsAggregated()
  const useAggregatedEl = isAggregated && props.renderCase === 'grouping'
  const realEl = useAggregatedEl ? getAggregatedEl(cell) : props.children
  return (
    <span
      // expanding
      className={cls()}
      data-case="expanding"
      data-text-align={props.textAlign}
      data-is-aggregated={isAggregated}
    >
      <span className={cls('wrapper')}>
        {row.depth > 0 && (
          <span
            className={cls('indent')}
            data-depth={row.depth}
            style={{ width: `calc(${indentLevel} * var(${INDENT_VAR_NAME}))` }}
          ></span>
        )}
        {isAggregated ? (
          <span
            // icon
            className={cls('icon')}
            data-is-expanded={isExpanded}
            onClick={handleExpandClick}
          >
            {row.getCanExpand() ? <CaretRightFilled /> : null}
          </span>
        ) : null}
      </span>

      {realEl}
    </span>
  )
}

function getAggregatedEl(cell: RowExpandingWrapperProps['cell']) {
  return flexRender(
    cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
    cell.getContext()
  )
}
