import { Column } from '@tanstack/react-table'
import { ROW_SELECTION_COL_WIDTH } from '../const'
import type { EditableSchemaTableCtxType } from '../ctx'

type FixedStyleResult = {
  className?: string[]
  style?: React.CSSProperties
}

type GetFixedStyleOptsType = {
  globalStaticRef: EditableSchemaTableCtxType['globalStaticRef']
}

export function getFixedStyles<TData>(
  column: Column<TData>,
  opts: GetFixedStyleOptsType
): FixedStyleResult {
  const isPinned = column.getIsPinned()
  if (!isPinned) return {}

  const style: React.CSSProperties = {}

  if (isPinned === 'left') {
    const className = ['fixed-left']

    // 如果开启行选择，则需要增加偏移量，+1是边框的偏移
    const { enableRowSelection } = opts.globalStaticRef.current
    const offset = enableRowSelection ? ROW_SELECTION_COL_WIDTH : 0
    style.left = column.getStart('left') + offset

    // 增加阴影
    const isLastLeft = column.getIsLastColumn('left')
    if (isLastLeft) className.push('last-fixed-left')

    return { className, style }
  }

  if (isPinned === 'right') {
    const className = ['fixed-right']
    style.right = column.getAfter('right')

    // 如果开启行操作，则需要增加偏移量
    const { enableRowOperation, operationColWidth } = opts.globalStaticRef.current
    const offset = enableRowOperation ? operationColWidth : 0
    style.right = column.getAfter('right') + offset

    // 增加阴影
    const isFirstRight = column.getIsFirstColumn('right')
    if (isFirstRight) className.push('first-fixed-right')

    return { className, style }
  }

  return {}
}
