import React from 'react'
import { useDeepCompareEffect, useLatest } from 'ahooks'
import { useSubscribe, NOOP_SUBSCRIPTION } from '@hi-ui/use-subscription'
import { Schedular } from '@hi-ui/schema-utils'
import { useDeepCompareMemo } from '@hi-ui/schema-hooks'
import { BatchDepUpdate } from '@hi-ui/schema-fields' // TODO 待拆分
import type {
  FieldConfigType,
  DependencyValueFn as DepValueFn,
  FormDependencyValueCtx,
} from '@hi-ui/schema-core'
import { useSchemaFormCtx } from '../ctx'
import { FormItemEl, type FormItemElProps } from './elem'
import { useFormControlState } from '../ref-control'
import { generateDepPropsField } from './props-deps'
import { ReadonlyFormItemEl, checkIsReadonly } from './readonly'

export type FormItemElWrapperProps<TData extends AnyObject = AnyObject> = {
  field: FieldConfigType<TData>
  /** 额外的表单元素属性 */
  extraElProps?: Omit<FormItemElProps, 'field'>
}

/**
 * 表单元素节点包装器
 * @desc 主要负责处理【表单字段定义】的【值】和【props】的监听逻辑
 */
export function FormItemElWrapper<TData extends AnyObject>(props: FormItemElWrapperProps<TData>) {
  const { field } = props

  const { formValue, formRef, propsRef } = useSchemaFormCtx<TData>()

  // 有配置字段依赖，则此处忽略 deps 配置
  const deps = field.dependency?.fields ? undefined : field.dependency?.deps
  const hasValidDeps = (deps?.length || 0) > 0
  const subscription = hasValidDeps ? formValue : NOOP_SUBSCRIPTION

  const { allDepValues: depValues, changedDepKeys } = useSubscribe<TData>(subscription, deps)

  const { value: depValueFn } = field.dependency || {}

  // 获取 FormControl 状态 - 使用 field.dataIndex 而不是 field.key
  const { getFieldControlState } = useFormControlState([field.dataIndex])
  const fieldControlState = getFieldControlState(field.dataIndex)

  // 处理 props 依赖
  const depPropsCtxRef = useLatest({
    field,
    formRef,
    depValues,
    changedDepKeys,
    allValues: formValue.getValue(),
    fieldControlState,
  })
  // 仅在 depValues 或 fieldControlState 变化时，重新计算 nextField
  const nextField = useDeepCompareMemo(() => {
    const { field, ...ctx } = depPropsCtxRef.current as NonNullable<typeof depPropsCtxRef.current>
    return generateDepPropsField(field as FieldConfigType, ctx)
  }, [deps, depValues, field, fieldControlState])

  useDeepCompareEffect(() => {
    if (deps && deps.length > 0 && depValueFn) {
      // 计算新值
      const newValue = (depValueFn as DepValueFn<TData>)(depValues, {
        allValues: formValue.getValue(),
        changedDepKeys,
        formRef,
        batchUpdate: BatchDepUpdate.update,
      } as FormDependencyValueCtx<TData>)

      // 检查是否批量更新
      const finalValue = BatchDepUpdate.getValues<TData>(field.dataIndex, newValue)
      // 延迟一下再更新，主要是为了避免挂载时 formRef 尚未赋值
      Schedular.nextMacro(() => {
        // 此处使用 mergeFieldsValue 而非 setFieldsValue
        // 主要是为了避免复杂字段依赖时，单个子字段仅返回自身的值，导致其他子字段的值被覆盖
        formRef.current?.mergeFieldsValue?.(finalValue)
      })
    }
  }, [deps, depValues])

  // 如果字段被配置为隐藏，则不渲染
  if (nextField.control?.hidden) return null

  // 检查是否为只读状态
  const readonly = checkIsReadonly({
    field: field.control?.readonly,
    complexField: props.extraElProps?.isComplexFieldReadonly,
    group: props.extraElProps?.isReadonlyGroup,
    form: propsRef.current.readonly,
  })

  if (readonly) {
    return <ReadonlyFormItemEl field={nextField as FieldConfigType} {...props.extraElProps} />
  }

  // 返回真实的表单元素
  return <FormItemEl field={nextField as FieldConfigType} {...props.extraElProps} />
}
