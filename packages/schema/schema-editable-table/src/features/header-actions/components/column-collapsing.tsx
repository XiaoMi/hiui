import React from 'react'
import { MinusSquareOutlined, PlusSquareOutlined } from '@hi-ui/icons'
import type { FieldCustomHeaderActionsCtxType } from '../type'

type ColumnCollapsingActionProps = Pick<
  FieldCustomHeaderActionsCtxType,
  'column' | 'field' | 'table'
>

// NOTE 列折叠先支持到这种程度吧，集成度还能更高一点，但是时间比较紧张，有后续诉求的话再考虑优化
// 比如默认有子列的都折叠起来，目前是全部都展开
export function ColumnCollapsingAction(props: ColumnCollapsingActionProps) {
  const { table, field } = props
  const { customColumnCollapsing: columnCollapsing } = table.getState()

  const [hasCollapsed, setHasCollapsed] = React.useState(() => {
    return columnCollapsing?.[field.dataIndex] ?? false
  })

  if (!field.children || field.children.length <= 1) return null

  const handleClick = () => {
    if (!field.children) return
    if (field.children.length <= 1) return

    // 先设置内部状态
    setHasCollapsed(!hasCollapsed)

    // 再更新自定义状态
    table.setState((state) => {
      return {
        ...state,
        customColumnCollapsing: {
          ...state.customColumnCollapsing,
          [field.dataIndex]: !hasCollapsed, // 只在父列上设置折叠状态
        },
      }
    })

    // 最后修改列展示状态 // Record<string, boolean>
    const visibilityState = field.children
      // 排除最后一个子列 // 否则全都隐藏的话，父列也就不展示了
      .slice(0, -1)
      // 折叠时，子列不展示
      .map((childColumn) => ({ [childColumn.dataIndex]: hasCollapsed }))
      .reduce((acc, curr) => ({ ...acc, ...curr }), {})

    table.setColumnVisibility((state) => ({ ...state, ...visibilityState }))
  }

  return (
    <span>
      {hasCollapsed ? (
        <PlusSquareOutlined size={14} onClick={handleClick} />
      ) : (
        <MinusSquareOutlined size={14} onClick={handleClick} />
      )}
    </span>
  )
}
