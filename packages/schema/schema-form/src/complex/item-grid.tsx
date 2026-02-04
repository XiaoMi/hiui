import React, { useEffect } from 'react'
import { get, isNil } from 'lodash-es'
import { GridHelper, type BasicGridOptsType } from '@hi-ui/auto-grid'
import { FieldCreatorHelper, type FieldConfigType } from '@hi-ui/schema-core'
import { useSubscribe } from '@hi-ui/use-subscription'
import { useReadonlyRef, useDeepCompareMemo } from '@hi-ui/schema-hooks'
import { useSchemaFormCtx } from '../ctx'
import { FormFieldsMapper } from '../item/mapper'
import { cls, normalizeDataIndex } from '../_utils'
import type { FormItemElProps } from '../item/elem'
import type { FormItemProps } from '../type'

type SubFieldItemGridProps = {
  /**
   * 对象或者列表字段的字段本身
   * - 注意与 fields 区分
   */
  field: FieldConfigType
  dataIndex: string | (string | number)[]
  /** 是否丢弃自身 dataIndex */
  discardSelfIndex?: boolean
  fields: FieldConfigType | FieldConfigType[]
  gridProps: BasicGridOptsType | undefined
  formItemProps?: FormItemProps
  nestLevel: number
  className: string
  /** 默认隐藏 label */
  dftHideLabel?: boolean
  customLabelCtx?: FormItemElProps['customLabelCtx']
}

export function SubFieldItemGrid(props: SubFieldItemGridProps) {
  const { formValue, formRef } = useSchemaFormCtx()
  const { fields, normalizeChildField } = normalizeChildFields(props)

  // 生成当前字段级别的依赖数据
  const dIndex = normalizeDataIndex(props.dataIndex)
  const deps = [dIndex[0]] as string[] // 用于路径取值，因此可以强转
  const { allDepValues } = useSubscribe(formValue, deps)
  const depValues = get(allDepValues, dIndex) || {}

  // 创建缓存,在 fields 变化时重置
  const depFieldsCacheRef = useReadonlyRef(() => new Map<string, FieldConfigType[]>())
  // 添加缓存清理
  useEffect(() => () => depFieldsCacheRef.current.clear(), [depFieldsCacheRef])

  const { nodes } = useDeepCompareMemo(() => {
    return FormFieldsMapper({
      fields,
      depValues,
      depFieldsCacheRef,
      changedDepKeys: Object.keys(depValues),
      allValues: formValue.getValue(),
      formRef,
      depFieldsPropName: 'childFields',
      parentDataIndex: dIndex as string[],
      itemExtraElProps: {
        nestLevel: props.nestLevel + 1,
        customLabelCtx: props.customLabelCtx,
        isComplexFieldReadonly: props.field.control?.readonly,
      },
      normalizeChildField,
    })

    // NOTE 目前最关键的值就只有depValues一项
    // 若发现不满足需求，可再更新依赖数组
  }, [depValues, fields])

  return (
    <GridHelper
      // grid
      className={cls(props.className)}
      nodes={nodes}
      {...props.gridProps}
    />
  )
}

// 子字段有默认值，此处单独处理后输出标准的字段定义
function normalizeChildFields(props: SubFieldItemGridProps) {
  const _fields = props.fields
  const fields = Array.isArray(_fields) ? _fields : [_fields]

  // 用闭包保存当前上下文，用来在 FormFieldsMapper 中处理返回的新字段
  function normalizeChildField(childField: FieldConfigType) {
    const helper = new FieldCreatorHelper()
    helper.setInstance(childField)

    const dataIndex = normalizeDataIndex(
      props.discardSelfIndex ? [props.dataIndex] : [props.dataIndex, childField.dataIndex]
    )

    helper.mergeVal({
      // @ts-expect-error dataIndex 在表单中可以是数组，此处忽略类型错误
      dataIndex,
      key: dataIndex.join('.'),
    })

    // 合并 formItemProps
    if (props.formItemProps) {
      const selfFormItemProps = helper.instance.val.formItemProps
      helper.setPipeGetter('formItemProps', props.formItemProps)
      helper.setPipeGetter('formItemProps', selfFormItemProps) // 字段自身的优先级更高
    }

    // 配置了默认隐藏label
    // 则在未配置 hideLabel 时，默认设置为 true
    if (props.dftHideLabel && isNil(childField.control?.hideLabel)) {
      helper.mergeVal({ control: { hideLabel: true } })
    }

    return helper.val
  }

  // 遍历字段，生成标准的字段定义
  const nextFields = fields.map(normalizeChildField)

  return {
    fields: nextFields,
    normalizeChildField,
  }
}
