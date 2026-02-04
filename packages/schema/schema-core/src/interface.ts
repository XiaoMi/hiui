/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
import type React from 'react'

// fields
export interface EnhancedRenderersType {}
export interface ProFieldsProps {}
export interface BuiltinFieldMapType {}

export interface ImageUploadProps {}
export interface ProCascaderProps {}
export interface ProCheckboxProps {}
export interface ProCheckCascaderProps {}
export interface ProCheckSelectProps {}
export interface ProCheckTreeSelectProps {}
export interface ProCounterProps {}
export interface ProDateProps {}
export interface ProImageProps {}
export interface ProLinkProps {}
export interface ProNumberProps {}
export interface ProRadioProps {}
export interface ProRatingProps {}
export interface ProSelectProps {}
export interface ProSliderProps {}
export interface ProSwitchProps {}
export interface ProTagProps {}
export interface ProTextAreaProps {}
export interface ProTextProps {}
export interface ProTimePickerProps {}
export interface ProTreeSelectProps {}
export interface ProUploadProps {}
export interface ProEditTableProps {}
export interface ProNumberRangeProps {}
export interface FormEditTableToolbarCtxType {}

// components
export interface DependencyRenderCtx<TData> {}
export interface InterruptConfigType {}
// TODO 多个类型待更新
/* 筛选类型，由 schema-components 提供具体字面量；此处为默认以支持单独使用 types 包 */
export type FilterType = string
export interface CustomFilterProps {}
export interface FilterExtraOptsType {}
export interface TableSorterProps {}
export interface TableToolbarCtxType {}

// components/grid
export interface GridHelperProps {}

// components/action-trigger
export interface ActionsProps {}

// renderers/form
export interface SchemaFormProps {}
export interface FormItemProps {}
export interface EnhancedFormRefType<TData extends AnyObject = AnyObject> {}
export interface FormFieldDataIndexType {}
export interface FormItemWrapperProps {}
export interface FormRule {}
export interface FormObjectConfigType {}
export interface FormListConfigType {}
export interface FormGroupActionCtxType {}
export interface ListActionCtxType {}
export interface ListItemActionCtxType {}
export interface FormBindingProps {}

// renderers/table
export interface SchemaTableProps {}

// renderers/descriptions
export interface SchemaDescriptionsProps {}

// renderers/editable-table
export interface EditTableProps {}
/* 可编辑上下文，由 schema-components 提供具体类型 */
export interface DynamicEditableCtxType {}
export interface FieldCustomHeaderActionsFn {
  (...args: AnyArray): any
}
/* 表头自定义操作组件，由 schema-components 提供具体类型 */
export interface FieldCustomHeaderActionComponent {}
/* 内置排序函数名，由 schema-components 提供具体字面量 */
export type BuiltInSortingFn = string
/* 内置筛选函数名，由 schema-components 提供具体字面量 */
export type BuiltInFilterFn = string
export interface GetHeaderCellWrapperDynamicAttrsFnType {
  (...args: AnyArray): any
}
export interface GetBodyCellWrapperDynamicAttrsFnType {
  (...args: AnyArray): any
}
export interface OpButtonRenderCtx<TData> {}
export interface BottomRenderCtxType {}

// renderers/utils
export interface CustomLabelFn {}
/* 自定义 label 使用场景，由 schema-components 提供具体字面量 */
export type CustomLabelUsedBy = string | undefined
export interface BatchDepUpdate {}

// pro-components/table
export interface ProTableToolbarProps {}
