import React from 'react'
import { Actions, type ActionsProps } from '@hi-ui/action-trigger'
import { getGetterValue } from '@hi-ui/schema-utils'
import { useEditTableCtx } from '../ctx'
import { Pagination } from '../features/pagination'
import { RowSelectionIndicator } from '../features/row-selection'
import { cls } from '../utils'
import type { EditTableCtxType } from '../index'

type BottomRenderActionsType = ActionsProps<AnyObject[], BottomRenderCtxType>['actions']

export type BottomRenderConfigType = {
  left?: AnyGetter<CustomLeftActionRenderType>
  right?: AnyGetter<CustomLeftActionRenderType>
}

type BuiltinActionsType = AnyObject & {
  pagination: React.ReactElement | null
  rowSelectionIndicator: React.ReactElement | null
}

type CustomLeftActionRenderType = (
  ctx: BottomRenderCtxType & {
    builtin: BuiltinActionsType
  }
) => BottomRenderActionsType

export type BottomRenderCtxType = {
  tableCtx: EditTableCtxType
}

export function BottomRender(props: BottomRenderConfigType) {
  const tableCtx = useEditTableCtx()
  const { propsRef, globalStaticRef } = tableCtx

  const paginationEl = propsRef.current.pagination ? (
    <Pagination key="pagination" {...propsRef.current.pagination} />
  ) : null

  const rowSelectionIndicatorEl = propsRef.current.rowSelection?.enableIndicator ? (
    <RowSelectionIndicator key="row-selection-indicator" />
  ) : null

  const builtin: BuiltinActionsType = {
    rowSelectionIndicator: rowSelectionIndicatorEl,
    pagination: paginationEl,
  }
  const dftLeft = [rowSelectionIndicatorEl]
  const dftRight = [paginationEl]

  const { left: getLeft, right: getRight } = props

  const ctx = { tableCtx, builtin }
  const left = getGetterValue(getLeft, dftLeft, [ctx])
  const right = getGetterValue(getRight, dftRight, [ctx])

  return (
    <div
      className={cls('bottom-container')}
      data-is-bottom-empty={globalStaticRef.current.isBottomEmpty}
    >
      <Actions
        // left
        className={cls('bottom-container-left')}
        actions={left}
        data={[]}
        ctx={{ tableCtx }}
      />

      <Actions
        // right
        className={cls('bottom-container-right')}
        actions={right}
        data={[]}
        ctx={{ tableCtx }}
      />
    </div>
  )
}
