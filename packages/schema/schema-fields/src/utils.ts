import { getPipeGetterValue, mergeProps } from '@hi-ui/schema-utils'
import { wrapFormBinding } from './utils/form-binding'
import type { FormItemProps } from '@hi-ui/schema-core'
import type { ProFieldRenderCtx, ProFieldRenderFormItemCtx } from './base'

export { wrapFormBinding }
export * from './utils/label'
export * from './utils/batch-dep-update'

/**
 * 普适的字段上下文类型，用于获取字段属性
 * @desc 包含字段本身的属性，以及可选的表单绑定属性
 */
export type NormalFieldCtxType<FieldProps extends AnyObject> = Pick<
  ProFieldRenderCtx<FieldProps>,
  'field'
> &
  Partial<Pick<ProFieldRenderFormItemCtx<FieldProps>, 'formBinding'>>

export function getFieldProps<FieldProps extends AnyObject>(
  dftProps: FieldProps,
  ctx: NormalFieldCtxType<FieldProps>
) {
  const fieldProps = getPipeGetterValue(dftProps, ctx.field.fieldProps)

  // formBinding 本质是 Form 注入给 field 的属性，因此在此处统一处理
  const formBindingProps = ctx.formBinding
    ? wrapFormBinding(ctx.formBinding, fieldProps)
    : ({} as FieldProps)

  return mergeProps(fieldProps, formBindingProps as FieldProps)
}

export function getWrapperProps<WrapperProps extends AnyObject>(
  dftProps: WrapperProps,
  ctx: Pick<ProFieldRenderCtx<AnyObject, WrapperProps>, 'field'>
) {
  return getPipeGetterValue(dftProps, ctx.field.wrapperProps)
}

export type GetFormItemPropsCtxType = Pick<ProFieldRenderCtx, 'field'>

export function getFormItemProps(dftProps: FormItemProps, ctx: GetFormItemPropsCtxType) {
  return getPipeGetterValue(dftProps, ctx.field.formItemProps)
}
