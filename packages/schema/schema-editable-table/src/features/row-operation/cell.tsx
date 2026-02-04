import React from 'react'
import type { Row } from '@tanstack/react-table'
import { useEditableSchemaTableCtx } from '../../ctx'
import { cls } from '../../utils/cls'
import { OpButtons } from './buttons'

type OperationBodyCellProps<TData extends AnyObject> = {
  row: Row<TData>
}

export function OperationBodyCell<TData extends AnyObject>(props: OperationBodyCellProps<TData>) {
  const { row } = props
  const { propsRef } = useEditableSchemaTableCtx<TData>()
  const { rowOperation } = propsRef.current

  if (!rowOperation) return null

  // 下面的 data-key={width} 仅仅是为了避开定义未使用的变量检查
  const { width, ...restOpts } = rowOperation
  return (
    <div className={cls('operation-buttons')}>
      <OpButtons data-key={width} row={row} {...restOpts} />
    </div>
  )
}
