import React from 'react'
import { cloneDeep } from 'lodash-es'
import { getFieldProps, type NormalFieldCtxType } from '@hi-ui/schema-fields'
import { Schedular } from '@hi-ui/schema-utils'
import { useIsFirstMount } from '@hi-ui/schema-hooks'
import type { FieldConfigType } from '@hi-ui/schema-core'
import { formItemPropsAreEqual } from '../item/memo'
import { cls } from '../_utils'
import type { SchemaFormProps } from '../form'
import type { FormItemWrapperProps } from '../type'
import { SubFieldItemGrid } from './item-grid'
import { ListActions, ItemActions } from './list-actions'
import type { ListActionCtxType, ListItemActionCtxType } from './list-actions'
import type { FormListConfigType } from './list'
import type { PatchedFormListActions } from './list-patch-actions'

export type FormListRenderProps = {
  field: FieldConfigType<FormListConfigType, FormItemWrapperProps>
  nestLevel: number
  value: unknown[]
  actions: PatchedFormListActions
  strictValueCompare: SchemaFormProps['strictValueCompare']
}

type FormListExtraSideElRenderCtxType = {
  dataIndex: string
  values: unknown[]
  nestLevel: number
}

export type { FormListExtraSideElRenderCtxType as ExtraSideElRenderCtxType }

export const FormListRender = React.memo(
  function FormListRender(props: FormListRenderProps) {
    const { field } = props
    const { value: values, actions } = props

    const fieldProps = getFieldProps(
      {} as FormListConfigType,
      { field } as NormalFieldCtxType<FormListConfigType>
    )
    // 列表字段子元素的表单项配置
    const childrenFormItemProps = fieldProps.formItemProps

    // 从field中获取字段取值模式
    const mode = Array.isArray(fieldProps.fields) ? 'multiple' : 'single'

    const listValues = useListValues({
      values,
      actions,
      itemDftValue: fieldProps.itemDftValue,
    })

    const listActionsCtx: ListActionCtxType = {
      fieldValue: values,
      innerActions: actions,
      itemDftValue: fieldProps.itemDftValue,
      nestLevel: props.nestLevel,
    }

    const hasExtraSideEl = !!fieldProps.extraSideEl || undefined
    return (
      <>
        <div
          className={cls('list-field__content')}
          data-has-extra={hasExtraSideEl} // extra
        >
          {listValues.map((value, index) => {
            const itemActionsCtx: ListItemActionCtxType = {
              ...listActionsCtx,
              index,
              itemValue: value,
            }

            return (
              // FormList 暴露的操作方法中有 swap 等交换顺序的方法
              // 因此拿 index 作为 key 可能是不安全的
              // TODO 但考虑到交换元素的场景不多，此处仅留注释等待后续优化
              <div
                key={index}
                className={cls('list-field__item')} // item
              >
                {/* {fieldProps.showIndex ? (
                  <div className={cls('list-field__item-index')}>{index + 1}</div>
                ) : null} */}

                <SubFieldItemGrid
                  field={field as FieldConfigType<AnyType>}
                  dataIndex={[field.dataIndex, index]}
                  // single 模式时，移除字段自身的 dataIndex
                  // 子项的本身作为数组元素，而不是作为对象数组的某个属性
                  // 例如，子项的索引为 fieldHello
                  // 例1：子项数据类型为 { hello: boolean }
                  // - 则 single 模式下，数组的元素为 { hello: boolean }
                  // - 则 multiple 模式下，数组的元素为 { fieldHello: { hello: boolean } }
                  // 例2，子项数据类型为 string
                  // - 则 single 模式下，数组的元素为 string
                  // - 则 multiple 模式下，数组的元素为 { fieldHello: string }
                  discardSelfIndex={mode === 'single'}
                  fields={fieldProps.fields}
                  formItemProps={childrenFormItemProps}
                  gridProps={fieldProps.gridProps}
                  nestLevel={props.nestLevel}
                  className="list-field__item-grid"
                  dftHideLabel={fieldProps.hideLabel ?? false}
                  // @ts-expect-error 此处报错缺少 formRef
                  // 无需担心，透传的 customLabelCtx 到 FormItem 时，会自动补充 formRef
                  customLabelCtx={itemActionsCtx}
                />

                {/* 有传入，并且长度为0，说明要禁用 Item 的操作按钮组 */}
                {fieldProps.itemActions?.length === 0 ? null : (
                  <div className={cls('list-field__item-actions-wrapper')}>
                    <ItemActions config={fieldProps} values={values} ctx={itemActionsCtx} />
                  </div>
                )}
              </div>
            )
          })}

          {hasExtraSideEl && (
            <div className={cls('list-field__content-extra')}>
              {fieldProps.extraSideEl?.render?.({
                dataIndex: field.dataIndex,
                values,
                nestLevel: props.nestLevel,
              })}
            </div>
          )}
        </div>

        {/* 有传入，并且长度为0，说明要禁用 List 的操作按钮组 */}
        {fieldProps.listActions?.length === 0 ? null : (
          <div className={cls('list-field__field-actions-wrapper')} style={{ paddingLeft: 0 }}>
            <ListActions
              title={field._titleText || field.title.toString()}
              config={fieldProps}
              values={values}
              ctx={listActionsCtx}
            />
          </div>
        )}
      </>
    )
  },
  (prev, next) => {
    return formItemPropsAreEqual(prev, next)
  }
)

type UseListValuesCtxType = {
  values: unknown[]
  itemDftValue: unknown
  actions: PatchedFormListActions
}

function useListValues(ctx: UseListValuesCtxType) {
  const { values, itemDftValue, actions } = ctx
  const isFirstMount = useIsFirstMount()

  // 简而言之，初次挂载时，列表为空时默认塞一条空数据进去
  if (isFirstMount.current && values.length === 0) {
    const listValues = values.length === 0 ? [cloneDeep(itemDftValue)] : values

    // 而且还要触发一次表单变化
    // 延迟执行则是因为：初次渲染时 handleItemsChange 内部的 formRef 还没准备到位
    Schedular.nextMicro(() => actions.handleItemsChange(listValues))

    return listValues
  }

  return values
}
