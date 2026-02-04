// 整体的目标是解决业务中80%的问题，不强求全部解决

export { SchemaFormCtx, useSchemaFormCtx } from './ctx'
export type * from './ctx'

export { useFieldsDependency } from './dependency'
export type * from './dependency'

// export { useFormFields } from './fields'
export { useGroupAndFields } from './fields'
export type * from './fields'

export { SchemaForm } from './form'
export type * from './form'
export type { SchemaFormProps } from './form'

export { SchemaFormRender } from './render'
export type * from './render'

export { FormItemEl } from './item/elem'
export { FormItemElWrapper } from './item/wrapper'
export { FormFieldsMapper } from './item/mapper'
export { generateDepPropsField } from './item/props-deps'
export type * from './item/mapper'

export { MemoFormBinding } from './item/memo'
export type * from './item/memo'

export { useFormRef } from './ref'
export type * from './ref'

export { useFormControlRef } from './ref-control'
export type * from './ref-control'

export type * from './type'

export { SchemaFormSubmit } from './extra/submit'
export type * from './extra/submit'

export { FormObjectEl } from './complex/object'
export type * from './complex/object'

export { FormListEl } from './complex/list'
export type * from './complex/list'

export { FormListRender } from './complex/list-render'
export type * from './complex/list-render'

export { ListActions, ItemActions } from './complex/list-actions'
export type * from './complex/list-actions'

export { SubFieldItemGrid } from './complex/item-grid'

export type { DependencyRenderCtx } from './dependency/index'
export {
  extractLabelProps,
  normalizeDataIndex,
  type DataIndexType,
  type NormalizedDataIndexType,
} from './_utils'
