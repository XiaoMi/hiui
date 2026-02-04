import React from 'react'
import Form from '@hi-ui/form'
import { getFormItemProps, getLabel, matchFieldClass } from '@hi-ui/schema-fields'
import type { FieldConfigType, FieldRendererType } from '@hi-ui/schema-core'
import type { GetFormItemPropsCtxType, FormListItemLabelCtxType } from '@hi-ui/schema-fields'
import { useSchemaFormCtx } from '../ctx'
import { MemoFormBinding, type FormBindingProps } from './memo'
import { FormListEl, type FormListConfigType } from '../complex/list'
import { FormObjectEl, type FormObjectConfigType } from '../complex/object'

export type FormItemElProps = {
  field: FieldConfigType
  /** 嵌套层级 */
  nestLevel?: number
  customLabelCtx?: FormListItemLabelCtxType
  /** 是否为复杂字段，且为只读 */
  isComplexFieldReadonly?: boolean
  /** 是否为只读组 */
  isReadonlyGroup?: boolean
}

/**
 * 表单元素节点
 * @desc 主要负责将【表单字段定义】转换为真实的【表单元素】
 */
export function FormItemEl(props: FormItemElProps) {
  const { field, nestLevel = 1 } = props
  const { propsRef, formRef, formValue } = useSchemaFormCtx()

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

  const FieldClass = matchFieldClass({
    name: 'SchemaForm',
    field,
    fieldMap: propsRef.current.fieldMap,
  })

  const label = getLabel(field, customLabelCtx)

  const formItemProps = getFormItemProps({}, { field } as GetFormItemPropsCtxType)

  const fieldRenderer = new FieldClass()

  const render: Required<FieldRendererType>['renderFormItem'] =
    field.renderer.renderFormItem || fieldRenderer.renderFormItem.bind(fieldRenderer)

  return (
    <Form.Item
      key={field.key}
      label={label}
      field={field.dataIndex}
      {...formItemProps}
      data-nest-level={nestLevel}
      data-field-type={field.valueType}
      data-field-key={field.key}
      data-must-in-group={field.extra?.mustInGroup}
      data-hide-label={field.control?.hideLabel}
    >
      {(formBinding: FormBindingProps) => {
        return (
          <MemoFormBinding
            {...formBinding}
            strictValueCompare={propsRef.current.strictValueCompare}
            field={field}
            render={render}
            rawData={formValue.getValue()}
            formRef={formRef}
          />
        )
      }}
    </Form.Item>
  )
}

// 为类型断言添加额外的类型守卫
export function isFormListField(
  field: FieldConfigType<AnyType>
): field is FieldConfigType<FormListConfigType> {
  return field.valueType === 'form-list-field'
}

export function isFormObjectField(
  field: FieldConfigType<AnyType>
): field is FieldConfigType<FormObjectConfigType> {
  return field.valueType === 'form-object-field'
}
