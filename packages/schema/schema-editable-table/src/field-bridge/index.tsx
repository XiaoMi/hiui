import React from 'react'
import { ProField } from '@hi-ui/schema-fields'
import type { ProFieldRenderCtx, ProFieldRenderFormItemCtx } from '@hi-ui/schema-fields'
import { EditTableBridge, type EditTableBridgeProps } from './bridge'

export { EditTableBridge, EditTableBridgeProps }

export type { FormEditTableToolbarCtxType } from './toolbar'

export type ProEditTableProps = EditTableBridgeProps & {
  // ProEditTableProps
}

export class ProEditTable extends ProField {
  render(data: AnyObject[] = [], ctx: ProFieldRenderCtx<EditTableBridgeProps>) {
    const fieldProps = this.getFieldProps({ fields: [] }, ctx)
    return <EditTableBridge {...fieldProps} value={data} readonly />
  }

  renderCell() {
    return <></> // 表格不允许嵌套在单元格中
  }

  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<EditTableBridgeProps>) {
    const fieldProps = this.getFieldProps({ fields: [] }, ctx)
    return <EditTableBridge {...fieldProps} />
  }
}
