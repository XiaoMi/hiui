import React from 'react'
import type { FieldRendererType, ProFieldRenderCellCtx, ProFieldRenderCtx } from '../index'
import type { EditableCaseProps } from './editable'

export type UsedBy = 'table' | 'other'

export type ReadonlyCaseProps<T extends UsedBy = 'other'> = Omit<EditableCaseProps, 'ctx'> & {
  usedBy: T
  ctx: T extends 'table' ? ProFieldRenderCellCtx : ProFieldRenderCtx
}

export function ReadonlyCase<T extends UsedBy = 'other'>(props: ReadonlyCaseProps<T>) {
  const { field, ctx, value, usedBy = 'other' } = props

  const fieldRenderer = new props.FieldClass()

  // 只读态时直接渲染只读视图
  // 此处实际上是 render | renderCell 的联合类型，收敛至 render 类型，避免 Any 缺少检查
  const render: Required<FieldRendererType>['render'] =
    usedBy === 'table'
      ? field.renderer?.renderCell ||
        field.renderer?.render ||
        fieldRenderer.renderCell.bind(fieldRenderer)
      : field.renderer?.render || fieldRenderer.render.bind(fieldRenderer)

  return <>{render(value, ctx)}</>
}
