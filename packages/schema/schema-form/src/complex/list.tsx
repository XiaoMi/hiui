import * as React from 'react'
import Form, { FormLabel } from '@hi-ui/form'
import { getFormItemProps, getLabel } from '@hi-ui/schema-fields'
import type { FieldConfigType } from '@hi-ui/schema-core'
import type { BasicGridOptsType } from '@hi-ui/schema-auto-grid'
import type { ActionsProps } from '@hi-ui/schema-action-trigger'
import { useSchemaFormCtx } from '../ctx'
import { cls, extractLabelProps } from '../_utils'
import type { FormItemProps, FormItemWrapperProps } from '../type'
import { FormListRender, type ExtraSideElRenderCtxType } from './list-render'
import { patchFormListActions } from './list-patch-actions'
import type { CustomListActionRenderType, CustomListItemActionRenderType } from './list-actions'

export type FormListConfigType = {
  /**
   * 字段项配置
   * - 传入单个字段配置时，内部会忽略字段的 dataIndex，将字段的值本身作为数据项，通常用于原始值数组
   * - 传入字段配置数组时，内部会将 [父字段 dataIndex, 索引, 字段 dataIndex] 作为数据项的 dataIndex，通常用于对象数组
   */
  fields: FieldConfigType | FieldConfigType[]
  /** 单个数据项的默认值 */
  itemDftValue?: unknown
  /** 字段子元素的表单项配置 */
  formItemProps?: FormItemProps
  /** 网格布局配置 */
  gridProps?: BasicGridOptsType
  /**
   * 是否隐藏 label
   * - 默认显示
   * - 如果需要隐藏，请设置为 true
   */
  hideLabel?: boolean
  // /**
  //  * 是否展示索引元素
  //  */
  // showIndex?: boolean
  /**
   * 【列表项整体】的操作按钮配置
   * - 渲染在列表项底部
   * - 默认展示新增按钮
   */
  listActions?: AnyGetter<CustomListActionRenderType>
  /**
   * 【列表项】的操作按钮配置
   * - 渲染在单个列表项的右侧
   * - 默认展示删除按钮
   */
  itemActions?: AnyGetter<CustomListItemActionRenderType>
  /**
   * 【列表项】的操作按钮的轴方向
   * - 默认方向为纵向 `column`
   */
  itemActionDirection?: ActionsProps['direction']
  /**
   * 【列表项】的侧边自定义元素
   */
  extraSideEl?: {
    render: (ctx: ExtraSideElRenderCtxType) => React.ReactNode
  }
}

export type FormListElProps = {
  field: FieldConfigType<FormListConfigType, FormItemWrapperProps>
  nestLevel: number
  customLabelCtx?: AnyType
}

export function FormListEl(props: FormListElProps) {
  const field = props.field as FieldConfigType<AnyType>
  const { propsRef, ...ctx } = useSchemaFormCtx()
  const formItemProps = getFormItemProps({}, { field })

  const label = getLabel(field, props.customLabelCtx)
  return (
    <FormLabel
      key={field.key}
      label={label}
      className={cls('list-field')}
      {...extractLabelProps(formItemProps)}
      data-nest-level={props.nestLevel}
      data-field-type={field.valueType}
      data-field-key={field.key}
      data-hide-label={field.control?.hideLabel}
      data-tiered-bg={field.control?.tieredBg}
      data-bordered={field.control?.bordered}
    >
      <Form.List name={field.dataIndex}>
        {function FormListRenderWrapper(childFields, actions) {
          const values = childFields.map((childField) => childField.value)

          const patchedActions = patchFormListActions({
            dataIndex: field.dataIndex,
            actions,
            formRef: ctx.formRef,
            handleValuesChangeRef: ctx.handleValuesChangeRef,
          })
          return (
            <FormListRender
              field={field}
              nestLevel={props.nestLevel}
              value={values}
              actions={patchedActions}
              strictValueCompare={propsRef.current.strictValueCompare}
            />
          )
        }}
      </Form.List>
    </FormLabel>
  )
}
