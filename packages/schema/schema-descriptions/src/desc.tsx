import React from 'react'
import { cx } from '@hi-ui/classname'
import Descriptions from '@hi-ui/descriptions'
import { mergeProps } from '@hi-ui/schema-utils'
import { matchFieldClass, useFieldMap, getLabel } from '@hi-ui/schema-fields'
import type { DescriptionsProps, DescriptionsItemProps } from '@hi-ui/descriptions'
import type { FieldConfigType } from '@hi-ui/schema-core'
import type { FieldRendererType, UseFieldMapOpts } from '@hi-ui/schema-fields'
import './index.scss'

export type DescriptionsRenderProps = Pick<
  SchemaDescriptionsProps,
  'fields' | 'dataSource' | 'fieldMap'
>

export function DescriptionsRender(props: DescriptionsRenderProps) {
  const { dataSource = {} } = props

  const fieldMap = useFieldMap(props)

  return (props.fields ?? []).map((field) => {
    const FieldClass = matchFieldClass({ name: 'SchemaDescriptions', field, fieldMap })

    const fieldRenderer = new FieldClass()

    const dataItem = dataSource[field.dataIndex] // 不处理空数据，交给field执行解决

    // 文本时自动增加超出显示省略号功能，否则直接使用用户传入值
    const label = getLabel(field)

    const className = cx(field.wrapperProps?.className, `data-field-key:${field.key}`)
    const render: Required<FieldRendererType>['render'] =
      field.renderer.render || fieldRenderer.render.bind(fieldRenderer)
    return (
      <Descriptions.Item
        label={label}
        key={field.key}
        {...field.wrapperProps}
        className={className}
      >
        {render(dataItem, {
          field: field as FieldConfigType<AnyType>,
          rowData: dataSource,
          rawData: dataSource,
        })}
      </Descriptions.Item>
    )
  })
}

// @doc-comment-start code-block
// ---
// title: SchemaDescriptionsProps
// api:
//   for: descriptions.basic
//   order: 10
// ---
export type SchemaDescriptionsProps = UseFieldMapOpts & {
  fields: FieldConfigType<AnyObject, DescriptionsItemProps>[]
  dataSource: AnyObject
  /** 透传的描述列表容器样式 */
  className?: string
  descriptionsProps?: DeepPartial<Omit<DescriptionsProps, 'className'>>
}
// @doc-comment-end code-block

export function SchemaDescriptions(props: SchemaDescriptionsProps) {
  const dftProps: DescriptionsProps = {
    column: 3,
    labelWidth: 100,
    labelPlacement: 'right',
  }
  const finalProps = mergeProps(dftProps, props.descriptionsProps as DescriptionsProps, {
    className: cx('schema-descriptions', props.className),
  })

  // fields 未配置，是无效引用
  if (!props.fields) return null
  return <Descriptions {...finalProps}>{DescriptionsRender(props)}</Descriptions>
}
