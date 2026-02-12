import React from 'react'
import { get } from 'lodash-es'
import { FormLabel } from '@hi-ui/form'
import { getFormItemProps, matchFieldClass, getLabel } from '@hi-ui/schema-fields'
import { useSubscribeTickState } from '@hi-ui/schema-hooks'
import type { FieldConfigType, FieldRendererType, ProFieldRenderCtx } from '@hi-ui/schema-core'
import type { FormListItemLabelCtxType } from '@hi-ui/schema-fields'
import { useSchemaFormCtx } from '../ctx'
import { FormListEl } from '../complex/list'
import { FormObjectEl } from '../complex/object'
import { cls, extractLabelProps } from '../_utils'
import { isFormListField, isFormObjectField } from './elem'

export type FormItemElProps = {
  field: FieldConfigType
  /** 嵌套层级 */
  nestLevel?: number
  customLabelCtx?: FormListItemLabelCtxType
}

/**
 * 表单元素节点
 * @desc 主要负责将【表单字段定义】转换为表单项【只读元素】
 */
export function ReadonlyFormItemEl(props: FormItemElProps) {
  const { field, nestLevel = 1 } = props
  const { propsRef, formRef, formValue, tickState } = useSchemaFormCtx()

  // 此处用来触发只读模式下，表单项的更新
  // 否则只读元素不会响应 setFieldsValue 的更新
  useSubscribeTickState(tickState)

  const values = formValue.getValue()
  const value = get(values, field.dataIndex)

  const customLabelCtx = {
    ...props.customLabelCtx,
    formRef,
  } as FormListItemLabelCtxType

  // 处理数组类型字段
  if (isFormListField(field)) {
    return <FormListEl field={field} nestLevel={nestLevel} customLabelCtx={customLabelCtx} />
  }

  // 处理对象类型字段
  if (isFormObjectField(field)) {
    return <FormObjectEl field={field} nestLevel={nestLevel} customLabelCtx={customLabelCtx} />
  }

  const formItemProps = getFormItemProps({}, { field } as Parameters<typeof getFormItemProps>[1])

  const FieldClass = matchFieldClass({
    name: 'SchemaForm',
    field,
    fieldMap: propsRef.current.fieldMap,
  })

  const fieldRenderer = new FieldClass()

  const label = getLabel(field)

  /** 走到这里 说明是只读模式 */
  const render: Required<FieldRendererType>['render'] =
    field.renderer.render || fieldRenderer.render.bind(fieldRenderer)

  return (
    <FormLabel
      key={field.key}
      label={label}
      className={cls('object-field')}
      {...extractLabelProps(formItemProps)}
      data-nest-level={props.nestLevel}
      data-field-type={field.valueType}
      data-field-key={field.key}
      data-must-in-group={field.extra?.mustInGroup}
      data-hide-label={field.control?.hideLabel}
      data-bordered={field.control?.bordered} // 好像用不上，待确认后删除
    >
      {render(value, {
        field,
        rowData: values,
        rawData: values,
      } as ProFieldRenderCtx)}
    </FormLabel>
  )
}

type CheckIsReadonlyOptsType = {
  field?: boolean
  complexField?: boolean
  group?: boolean
  form?: boolean
}

export function checkIsReadonly(opts: CheckIsReadonlyOptsType) {
  // 优先级: field > complexField > group > form，使用空值合并运算符实现优先级查找
  return opts.field ?? opts.complexField ?? opts.group ?? opts.form ?? false
}
