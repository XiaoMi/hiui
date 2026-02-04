import React from 'react'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip'
import type {
  FieldConfigType,
  EnhancedFormRefType,
  ListItemActionCtxType,
} from '@hi-ui/schema-core'

export type FormItemLabelCtxType = {
  formRef: EnhancedFormRefType
}

export type FormListItemLabelCtxType = FormItemLabelCtxType & ListItemActionCtxType

// // 暂时用不到，留待后续扩咱
// export type DescriptionsItemLabelCtx = {
//   value: unknown
//   dataSource: AnyObject
// }

export type OtherCustomLabelCtxType = {
  // 空的，留着做示例
}

export type CustomLabelUsedBy = 'FormItem' | 'FormListItem' | 'Other' | undefined

// prettier-ignore
export type GetLabelCtxType<T extends CustomLabelUsedBy = CustomLabelUsedBy> =
  T extends 'FormItem' ? FormItemLabelCtxType
  : T extends 'FormListItem' ? FormListItemLabelCtxType
  : T extends 'Other' ? OtherCustomLabelCtxType
  // 再有新的，抄一行就是了
  : undefined

export type CustomLabelFn<T extends CustomLabelUsedBy = CustomLabelUsedBy> = (
  ctx: GetLabelCtxType<T>
) => React.ReactNode

export function getLabel<T extends CustomLabelUsedBy = CustomLabelUsedBy>(
  field: FieldConfigType,
  ctx?: GetLabelCtxType<T>
) {
  // 在组中时，不需要显示 label
  if (field.extra?.mustInGroup) return undefined

  if (typeof field.extra?.customLabel === 'function') {
    return field.extra?.customLabel(ctx)
  }

  return typeof field.title === 'string' ? (
    <EllipsisTooltip>{field.title}</EllipsisTooltip>
  ) : (
    field.title
  )
}
