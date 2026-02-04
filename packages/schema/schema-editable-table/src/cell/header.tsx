import React from 'react'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip'
import type { HeaderContext } from '@tanstack/react-table'
import { useEditableSchemaTableCtx } from '../ctx'
import { cls } from '../utils'
import { isSystemCol } from '../const'
import { getHeaderActions } from '../features/header-actions/get-actions'

type HeaderCellProps<TData extends AnyObject> = Pick<
  HeaderContext<TData, unknown>,
  'column' | 'table'
>

export default React.memo(
  function HeaderCell<TData extends AnyObject>(props: HeaderCellProps<TData>) {
    const { column, table } = props
    const field = props.column.columnDef.meta?.field

    const { globalStaticRef } = useEditableSchemaTableCtx<TData>()

    const invalidField = !field
    if (invalidField) return null

    // 文本对齐
    const textAlign = props.column.columnDef.meta?.align

    // 系统列仅包含展示功能
    if (isSystemCol(column.id)) {
      return (
        <div className={cls('header-cell-content')} data-text-align={textAlign}>
          <span className={cls('header-cell-content-title')}>{field.title}</span>
        </div>
      )
    }

    // 表头操作
    const actions = getHeaderActions({ column, table, field, globalStaticRef })

    const hoverOnly =
      (field.control?.hoverOnly ?? globalStaticRef.current.enableHeaderActionHoverOnly) || undefined

    return (
      <div
        className={cls('header-cell-content')}
        data-text-align={textAlign}
        data-has-children={field.children ? true : undefined}
        data-has-filter={actions?.filterAvailable || undefined}
        data-has-sorter={actions?.sorterAvailable || undefined}
        data-actions-count={actions?.elements.length || undefined}
        data-is-required={field.control?.required}
        data-hover-only={hoverOnly}
      >
        <span className={cls('header-cell-content-title')}>
          <EllipsisTooltip>{field.title as string}</EllipsisTooltip>
        </span>
        <span className={cls('header-cell-content-actions')}>{actions?.elements}</span>
      </div>
    )
  }
  // propsAreEqual暂时置空
) as <TData extends AnyObject>(props: HeaderCellProps<TData>) => React.ReactElement
