import { useMemo } from 'react'
import type { VisibilityState, ColumnPinningState, ColumnOrderState } from '@tanstack/table-core'
import type { FieldConfigType } from '@hi-ui/schema-core'
import type { EditableSchemaTableProps } from '../table'

export type ColumnState = {
  columnVisibility: VisibilityState
  columnPinning: ColumnPinningState
  columnOrder: ColumnOrderState
}

/**
 * 根据字段配置生成表格列的初始状态
 */
export function getInitialColumnState(fields: FieldConfigType[]): ColumnState {
  const columnVisibility: Record<string, boolean> = {}
  const leftPinned: string[] = []
  const rightPinned: string[] = []
  const normalColumns: string[] = []

  fields.forEach((field) => {
    // 处理显隐状态
    if (field.control?.hidden) {
      columnVisibility[field.dataIndex] = false
    }

    // 处理固定状态和列顺序
    if (field.control?.fixed === 'left') {
      leftPinned.push(field.dataIndex)
    } else if (field.control?.fixed === 'right') {
      rightPinned.push(field.dataIndex)
    } else {
      normalColumns.push(field.dataIndex)
    }
  })

  return {
    columnVisibility,
    columnPinning: {
      left: leftPinned.length ? leftPinned : undefined,
      right: rightPinned.length ? rightPinned : undefined,
    },
    columnOrder: [...leftPinned, ...normalColumns, ...rightPinned],
  }
}

type UseInitialStateCtxType<TData extends AnyObject> = Pick<
  EditableSchemaTableProps<TData>,
  'fields'
>

export function useInitialColumnState<TData extends AnyObject>(ctx: UseInitialStateCtxType<TData>) {
  const { fields } = ctx

  return useMemo(() => {
    const initialState = getInitialColumnState(fields)
    return initialState
  }, [fields])
}
