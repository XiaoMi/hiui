import { FieldCreatorHelper, EditableFieldCreator } from '@hi-ui/schema-core'
import type {
  FieldConfigType,
  DependencyFieldPropsFn as DepFieldPropsFn,
  DependencyWrapperPropsFn as DepWrapperPropsFn,
  DependencyFormItemPropsFn as DepFormItemPropsFn,
} from '@hi-ui/schema-core'
import type { SchemaFormCtxType } from '../ctx'
import type { FieldControlState } from '../ref-control'

export type GenerateDepFieldConfigCtxType<TData extends AnyObject> = {
  formRef: SchemaFormCtxType<TData>['formRef']
  depValues: Pick<TData, keyof TData>
  changedDepKeys: (keyof TData)[]
  allValues: TData
  fieldControlState?: FieldControlState
}

export function generateDepPropsField<TData extends AnyObject>(
  field: FieldConfigType,
  ctx: GenerateDepFieldConfigCtxType<TData>
) {
  const {
    fieldProps: depFieldProps,
    wrapperProps: depWrapperProps,
    formItemProps: depFormItemProps,
  } = field.dependency?.props || {}
  const { fieldControlState } = ctx

  // 处理 props 依赖
  if (depFieldProps || depWrapperProps || depFormItemProps || fieldControlState) {
    const { depValues, allValues, changedDepKeys, formRef } = ctx

    const nextCtx = { field, allValues, changedDepKeys, formRef }

    const fieldProps = (depFieldProps as DepFieldPropsFn<TData>)?.(depValues, nextCtx)
    const formItemProps = (depFormItemProps as DepFormItemPropsFn<TData>)?.(depValues, nextCtx)
    const wrapperProps = (depWrapperProps as DepWrapperPropsFn<TData>)?.(depValues, nextCtx)

    const helper = new FieldCreatorHelper(EditableFieldCreator)
    helper.setInstance(field)
    helper.setPipeGetter('fieldProps', fieldProps)
    helper.setPipeGetter('formItemProps', formItemProps)
    helper.mergeVal({ wrapperProps: wrapperProps || {} })

    // 新增：应用 FormControl 状态
    if (fieldControlState) {
      // 应用隐藏状态
      if (typeof fieldControlState.hidden === 'boolean') {
        helper.instance.Hidden(fieldControlState.hidden)
      }

      // 应用禁用状态
      if (typeof fieldControlState.disabled === 'boolean') {
        helper.instance.Disabled(fieldControlState.disabled)
      }

      // 应用只读状态 // TODO 增加只读状态支持
      if (typeof fieldControlState.readonly === 'boolean') {
        helper.instance.RO(fieldControlState.readonly)
      }

      // 应用字段属性
      if (fieldControlState.fieldProps) {
        helper.setPipeGetter('fieldProps', fieldControlState.fieldProps)
      }

      // 应用必填状态
      if (fieldControlState.required === true) {
        helper.instance.Required()
      }

      // 应用其他表单项属性
      if (fieldControlState.formItemProps) {
        helper.setPipeGetter('formItemProps', fieldControlState.formItemProps)
      }
    }

    return helper.val as FieldConfigType<TData>
  }

  return field
}
