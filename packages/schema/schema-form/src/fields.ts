// import React from 'react'
import { useEffect, useMemo } from 'react'
import { set } from 'lodash-es'
import { useReadonlyRef } from '@hi-ui/schema-hooks'
import { groupPredicates } from '@hi-ui/schema-core'
import type { FieldConfigType, GroupConfigType } from '@hi-ui/schema-core'
import { useFieldsDependency } from './dependency'
import { FormFieldMapperProps, FormFieldsMapper } from './item/mapper'
import { useSchemaFormCtx, type SchemaFormCtxType } from './ctx'
import { GroupedFieldsType } from './render/ctx'
import type { EnhancedFormRefType } from './ref'

/**
 * useFormFields
 * @deprecated 引入组渲染逻辑后，已被 useGroupAndFields 替代，不再使用
 */
export function useFormFields<TData extends AnyObject = AnyObject>(
  fields: FieldConfigType[],
  ctx: SchemaFormCtxType<TData>
) {
  const { formValue, formRef } = ctx
  const { allDepValues: depValues, changedDepKeys } = useFieldsDependency(fields, ctx).result

  // 创建缓存,在 fields 变化时重置
  const depFieldsCacheRef = useReadonlyRef(() => new Map<string, FieldConfigType[]>())
  // 添加缓存清理
  useEffect(() => () => depFieldsCacheRef.current.clear(), [depFieldsCacheRef])

  return useMemo(() => {
    return FormFieldsMapper({
      fields,
      depValues,
      depFieldsCacheRef,
      changedDepKeys,
      allValues: formValue.getValue(),
      formRef: formRef as EnhancedFormRefType<AnyObject>,
    })
  }, [fields, depValues, changedDepKeys, depFieldsCacheRef, formValue, formRef])
}

export function useGroupAndFields() {
  const ctx = useSchemaFormCtx()
  const { formValue, formRef, propsRef } = ctx
  const { groups, fields } = normalizeGroupAndFields(propsRef)

  const { allDepValues: depValues, changedDepKeys } = useFieldsDependency(fields, ctx).result

  // 创建缓存,在 fields 变化时重置
  const depFieldsCacheRef = useReadonlyRef(() => new Map<string, FieldConfigType[]>())
  // 添加缓存清理
  useEffect(() => () => depFieldsCacheRef.current.clear(), [depFieldsCacheRef])

  const groupedFields = useMemo(() => {
    const ctx: GenGroupedFieldsCtxType = {
      depValues,
      depFieldsCacheRef,
      changedDepKeys,
      allValues: formValue.getValue(),
      formRef,
    }

    return groups.map((group) => {
      return genGroupedFields(group, {
        ...ctx,
        itemExtraElProps: {
          isReadonlyGroup: group.control?.readonly,
        },
      })
    })
  }, [groups, depValues, changedDepKeys, depFieldsCacheRef, formValue, formRef])

  return {
    groups,
    groupedFields,
  }
}

export function normalizeGroupAndFields(propsRef: SchemaFormCtxType['propsRef']) {
  const { fields, groups } = propsRef.current

  const hereGroups = groups || [
    {
      type: 'simple',
      title: 'default',
      // ↑↑ 俩演员，用不到
      config: { fields },
      // 非标准的 GroupConfig 字段
      // 用于标识这一组是从单独的 fields 中转换来的
      fromNormalized: true,
    } as GroupConfigType<'simple'>,
  ]

  const nextGroups = hereGroups.map((group) => {
    // 给组元素上明确设置只读属性
    const readonly = group.control?.readonly ?? propsRef.current.readonly
    set(group, 'control.readonly', !!readonly)

    return group
  })

  const nextFields = flatFields(nextGroups)

  return {
    groups: nextGroups,
    fields: nextFields,
  }
}

export function flatFields(groups: GroupConfigType[]) {
  const fields = groups.flatMap((group) => {
    // 简单组是最直接的子组，直接返回
    if (groupPredicates.isSimple(group)) return group.config.fields

    // 可编辑表格直接返回绑定字段
    if (groupPredicates.isEditTable(group)) {
      const field = group.config.field
      return field ? [field] : []
    }

    // 网格组和标签页组是布局组，需要再次处理子组
    if (groupPredicates.isGrid(group) || groupPredicates.isTabs(group)) {
      const children = group.config.children
      if (!children) return []

      return children.flatMap((child: GroupConfigType) => {
        // 子元素中只处理 ①简单组
        if (groupPredicates.isSimple(child)) return child.config.fields

        // ②无渲染器绑定的子组
        if (groupPredicates.isChildGroups(child)) {
          const childGroups = child.groups
          if (!childGroups) return []

          return childGroups.flatMap((group) => {
            if (groupPredicates.isSimple(group)) return group.config.fields
            return []
          })
        }

        return []
      })
    }

    return [] // 其他类型均认为是空
  })

  return fields
}

type GenGroupedFieldsCtxType = Pick<
  FormFieldMapperProps,
  | 'depValues'
  | 'depFieldsCacheRef'
  | 'changedDepKeys'
  | 'allValues'
  | 'formRef'
  | 'itemExtraElProps'
>

function genGroupedFields(group: GroupConfigType, ctx: GenGroupedFieldsCtxType): GroupedFieldsType {
  const dftEmpty = { type: 'fields', fields: {} } as GroupedFieldsType

  if (groupPredicates.isSimple(group)) {
    return {
      type: 'fields',
      fields: FormFieldsMapper({ fields: group.config.fields, ...ctx }),
    }
  }

  if (groupPredicates.isEditTable(group)) {
    const field = group.config.field
    if (!field) return dftEmpty

    return {
      type: 'fields',
      fields: FormFieldsMapper({ fields: [field], ...ctx }),
    }
  }

  if (groupPredicates.isGrid(group) || groupPredicates.isTabs(group)) {
    const children = group.config.children
    if (!children) return dftEmpty

    return {
      type: 'groups',
      groups: children.map((child: GroupConfigType) => genGroupedFields(child, ctx)) || [],
    } as GroupedFieldsType
  }

  if (groupPredicates.isChildGroups(group)) {
    const childGroups = group.groups
    if (!childGroups) return dftEmpty

    return {
      type: 'child-groups',
      groups: childGroups.map((child: GroupConfigType) => genGroupedFields(child, ctx)),
    } as GroupedFieldsType
  }

  // 其余情况置空
  return dftEmpty
}
