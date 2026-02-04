import React from 'react'
import { FormLabel } from '@hi-ui/form'
import { getFieldProps, getFormItemProps, getLabel } from '@hi-ui/schema-fields'
import type { NormalFieldCtxType } from '@hi-ui/schema-fields'
import type { BasicGridOptsType } from '@hi-ui/auto-grid'
import type { FieldConfigType } from '@hi-ui/schema-core'
import { cls, extractLabelProps } from '../_utils'
import type { FormItemElProps } from '../item/elem'
import type { FormItemProps, FormItemWrapperProps } from '../type'
import { SubFieldItemGrid } from './item-grid'

export type FormObjectConfigType = {
  fields: FieldConfigType[]
  /**
   * 是否隐藏 label
   * - 默认隐藏
   * - 如果需要显示，请设置为 false
   */
  hideLabel?: boolean
  /** 字段子元素的表单项配置 */
  formItemProps?: FormItemProps
  /** 网格布局配置 */
  gridProps?: BasicGridOptsType
}

export type FormObjectElProps = {
  field: FieldConfigType<FormObjectConfigType, FormItemWrapperProps>
  nestLevel: number
  customLabelCtx?: FormItemElProps['customLabelCtx']
}

/**
 * FormObject组件
 * 用于渲染对象类型的表单字段，支持嵌套结构
 */
export function FormObjectEl(props: FormObjectElProps) {
  const field = props.field as FieldConfigType<AnyType>

  const fieldProps = getFieldProps(
    {} as FormObjectConfigType,
    { field } as NormalFieldCtxType<FormObjectConfigType>
  )
  // 对象字段本身的表单项配置
  const formItemProps = getFormItemProps({}, { field })

  // 从field中获取配置项
  const _fields = fieldProps.fields
  const fieldsConfig = Array.isArray(_fields) ? _fields : [_fields]
  // 字段子元素的表单项配置
  const childrenFormItemProps = fieldProps.formItemProps

  const label = getLabel(field, props.customLabelCtx)
  return (
    <FormLabel
      key={field.key}
      label={label}
      className={cls('object-field')}
      {...extractLabelProps(formItemProps)}
      data-nest-level={props.nestLevel}
      data-field-type={field.valueType}
      data-field-key={field.key}
      data-hide-label={field.control?.hideLabel}
      data-bordered={field.control?.bordered}
    >
      <SubFieldItemGrid
        field={field}
        dataIndex={field.dataIndex}
        discardSelfIndex={false}
        fields={fieldsConfig}
        formItemProps={childrenFormItemProps}
        gridProps={fieldProps.gridProps}
        nestLevel={props.nestLevel}
        className="object-field__grid"
        dftHideLabel={fieldProps.hideLabel ?? true}
        customLabelCtx={props.customLabelCtx}
      />
    </FormLabel>
  )
}
