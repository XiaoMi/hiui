/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
import type { InterruptConfigType as InterruptConfigTypeImpl } from '@hi-ui/interrupt-injector'
import type {
  CustomFilterProps as CustomFilterPropsImpl,
  FilterExtraOptsType as FilterExtraOptsTypeImpl,
  // FilterType as FilterTypeImpl,
  TableSorterProps as TableSorterPropsImpl,
} from '@hi-ui/table-extensions'
import type {
  EnhancedRenderersType as EnhancedRenderersTypeImpl,
  FieldRendererType as FieldRendererTypeImpl,
  ProFieldRenderEditCellCtx as ProFieldRenderEditCellCtxImpl,
  CustomLabelFn as CustomLabelFnImpl,
  // CustomLabelUsedBy as CustomLabelUsedByImpl,
  ProCascaderProps as ProCascaderPropsImpl,
  ProCheckboxProps as ProCheckboxPropsImpl,
  ProCheckCascaderProps as ProCheckCascaderPropsImpl,
  ProCheckSelectProps as ProCheckSelectPropsImpl,
  ProCheckTreeSelectProps as ProCheckTreeSelectPropsImpl,
  ProCounterProps as ProCounterPropsImpl,
  ProDateProps as ProDatePropsImpl,
  ProImageProps as ProImagePropsImpl,
  ProLinkProps as ProLinkPropsImpl,
  ImageUploadProps as ImageUploadPropsImpl,
  ProNumberProps as ProNumberPropsImpl,
  ProRadioProps as ProRadioPropsImpl,
  ProRatingProps as ProRatingPropsImpl,
  ProSelectProps as ProSelectPropsImpl,
  ProSliderProps as ProSliderPropsImpl,
  ProSwitchProps as ProSwitchPropsImpl,
  ProTagProps as ProTagPropsImpl,
  ProTextAreaProps as ProTextAreaPropsImpl,
  ProTextProps as ProTextPropsImpl,
  ProTimePickerProps as ProTimePickerPropsImpl,
  ProTreeSelectProps as ProTreeSelectPropsImpl,
  ProUploadProps as ProUploadPropsImpl,
  // ProEditTableProps as ProEditTablePropsImpl,
  ProNumberRangeProps as ProNumberRangePropsImpl,
  // ProUserProps as ProUserPropsImpl,
  ProFieldsProps as ProFieldsPropsImpl,
  BuiltinFieldMapType as BuiltinFieldMapTypeImpl,
  DynamicEditableCtxType as DynamicEditableCtxTypeImpl,
} from '@hi-ui/schema-fields'

import type {
  EnhancedFormRefType as EnhancedFormRefTypeImpl,
  FormBindingProps as FormBindingPropsImpl,
  FormItemProps as FormItemPropsImpl,
  FormItemWrapperProps as FormItemWrapperPropsImpl,
  FormListConfigType as FormListConfigTypeImpl,
  FormObjectConfigType as FormObjectConfigTypeImpl,
  FormRule as FormRuleImpl,
  SchemaFormProps as SchemaFormPropsImpl,
  DependencyRenderCtx as DependencyRenderCtxImpl,
  NormalizedDataIndexType as FormFieldDataIndexTypeImpl,
  FormGroupActionCtxType as FormGroupActionCtxTypeImpl,
  ListActionCtxType as ListActionCtxTypeImpl,
  ListItemActionCtxType as ListItemActionCtxTypeImpl,
} from '@hi-ui/schema-form'

import type { SchemaTableProps as SchemaTablePropsImpl } from '@hi-ui/schema-table'
import type { SchemaDescriptionsProps as SchemaDescriptionsPropsImpl } from '@hi-ui/schema-descriptions'

import type {
  EditTableProps as EditTablePropsImpl,
  GetHeaderCellWrapperDynamicAttrsFnType as GetHeaderCellWrapperDynamicAttrsFnTypeImpl,
  GetBodyCellWrapperDynamicAttrsFnType as GetBodyCellWrapperDynamicAttrsFnTypeImpl,
  FieldCustomHeaderActionsFn as FieldCustomHeaderActionsFnImpl,
  OpButtonRenderCtx as OpButtonRenderCtxImpl,
  BottomRenderCtxType as BottomRenderCtxTypeImpl,
  FieldCustomHeaderActionComponent as FieldCustomHeaderActionComponentImpl,
  FormEditTableToolbarCtxType as FormEditTableToolbarCtxTypeImpl,
  ProEditTableProps as ProEditTablePropsImpl,
} from '@hi-ui/schema-editable-table'

import type { TableToolbarCtxType as TableToolbarCtxTypeImpl } from '@hi-ui/action-trigger'

import { GridHelperProps as GridHelperPropsImpl } from '@hi-ui/auto-grid'

// import { BuiltInSortingFn as BuiltInSortingFnImpl } from '@/renderers/editable-table/features/sorter/get-sorter-config'

declare module '@hi-ui/schema-core' {
  // renderers
  interface SchemaTableProps extends SchemaTablePropsImpl {}
  interface SchemaDescriptionsProps extends SchemaDescriptionsPropsImpl {}

  // fields
  interface EnhancedRenderersType extends EnhancedRenderersTypeImpl {}
  interface ProFieldsProps extends ProFieldsPropsImpl {}
  interface BuiltinFieldMapType extends BuiltinFieldMapTypeImpl {}

  interface ImageUploadProps extends ImageUploadPropsImpl {}
  interface ProCascaderProps extends ProCascaderPropsImpl {}
  interface ProCheckboxProps extends ProCheckboxPropsImpl {}
  interface ProCheckCascaderProps extends ProCheckCascaderPropsImpl {}
  interface ProCheckSelectProps extends ProCheckSelectPropsImpl {}
  interface ProCheckTreeSelectProps extends ProCheckTreeSelectPropsImpl {}
  interface ProCounterProps extends ProCounterPropsImpl {}
  interface ProDateProps extends ProDatePropsImpl {}
  interface ProImageProps extends ProImagePropsImpl {}
  interface ProLinkProps extends ProLinkPropsImpl {}
  interface ProNumberProps extends ProNumberPropsImpl {}
  interface ProRadioProps extends ProRadioPropsImpl {}
  interface ProRatingProps extends ProRatingPropsImpl {}
  interface ProSelectProps extends ProSelectPropsImpl {}
  interface ProSliderProps extends ProSliderPropsImpl {}
  interface ProSwitchProps extends ProSwitchPropsImpl {}
  interface ProTagProps extends ProTagPropsImpl {}
  interface ProTextAreaProps extends ProTextAreaPropsImpl {}
  interface ProTextProps extends ProTextPropsImpl {}
  interface ProTimePickerProps extends ProTimePickerPropsImpl {}
  interface ProTreeSelectProps extends ProTreeSelectPropsImpl {}
  interface ProUploadProps extends ProUploadPropsImpl {}
  interface ProNumberRangeProps extends ProNumberRangePropsImpl {}
  // interface ProUserProps extends ProUserPropsImpl {}
  interface DynamicEditableCtxType extends DynamicEditableCtxTypeImpl {}
  interface ProEditTableProps extends ProEditTablePropsImpl {}

  // components
  interface GridHelperProps extends GridHelperPropsImpl {}
  interface DependencyRenderCtx<TData extends AnyObject = AnyObject>
    extends DependencyRenderCtxImpl<TData> {}
  interface InterruptConfigType extends InterruptConfigTypeImpl {}
  // FilterType 等由 @hi-ui/schema-core 以 type 别名提供，此处不再做 interface 扩展
  // interface FilterType extends FilterTypeImpl {}
  interface CustomFilterProps extends CustomFilterPropsImpl {}
  interface FilterExtraOptsType extends FilterExtraOptsTypeImpl {}
  interface TableSorterProps extends TableSorterPropsImpl {}

  // components/action-trigger
  interface TableToolbarCtxType extends TableToolbarCtxTypeImpl {}

  // renderers/form
  interface SchemaFormProps extends SchemaFormPropsImpl {}
  interface FormItemProps extends FormItemPropsImpl {}
  interface FormGroupActionCtxType extends FormGroupActionCtxTypeImpl {}
  interface ListActionCtxType extends ListActionCtxTypeImpl {}
  interface ListItemActionCtxType extends ListItemActionCtxTypeImpl {}

  interface EnhancedFormRefType<TData extends AnyObject = AnyObject>
    extends EnhancedFormRefTypeImpl<TData> {}
  interface FormFieldDataIndexType extends FormFieldDataIndexTypeImpl {}
  interface FormItemWrapperProps extends FormItemWrapperPropsImpl {}
  interface FormRule extends FormRuleImpl {}
  interface FormObjectConfigType extends FormObjectConfigTypeImpl {}
  interface FormListConfigType extends FormListConfigTypeImpl {}
  interface FormBindingProps extends FormBindingPropsImpl {}

  // renderers/editable-table
  interface EditTableProps extends EditTablePropsImpl {}
  interface GetHeaderCellWrapperDynamicAttrsFnType
    extends GetHeaderCellWrapperDynamicAttrsFnTypeImpl {}
  interface GetBodyCellWrapperDynamicAttrsFnType extends GetBodyCellWrapperDynamicAttrsFnTypeImpl {}
  interface FieldCustomHeaderActionsFn extends FieldCustomHeaderActionsFnImpl {}
  interface FieldCustomHeaderActionComponent extends FieldCustomHeaderActionComponentImpl {}
  // interface BuiltInSortingFn extends BuiltInSortingFnImpl {}
  // interface BuiltInFilterFn extends BuiltInFilterFnImpl {}
  interface OpButtonRenderCtx<TData extends AnyObject = AnyObject>
    extends OpButtonRenderCtxImpl<TData> {}
  interface BottomRenderCtxType extends BottomRenderCtxTypeImpl {}

  // 字段的可编辑表
  interface FormEditTableToolbarCtxType extends FormEditTableToolbarCtxTypeImpl {}

  // renderers/utils
  interface CustomLabelFn extends CustomLabelFnImpl {}
  // interface CustomLabelUsedBy extends CustomLabelUsedByImpl {}

  // pro-components/table
}

export {}
