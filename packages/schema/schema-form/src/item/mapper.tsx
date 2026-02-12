import React from 'react'
import { pick } from 'lodash-es'
import type { FieldConfigType, FormDependencyFieldsCtx } from '@hi-ui/schema-core'
import type { ReadonlyRefObject } from '@hi-ui/schema-hooks'
import type { SchemaFormCtxType } from '../ctx'
import type { SchemaFormProps } from '../form'
import type { FormItemWrapperProps } from '../type'
import { FormItemElWrapper, type FormItemElWrapperProps } from './wrapper'
import type { NormalizedDataIndexType } from '../_utils'

type FormFieldConfigType = FieldConfigType<AnyObject, FormItemWrapperProps>

export type FormFieldMapperProps = {
  fields: SchemaFormProps['fields']
  /** 依赖字段的值，包含所有依赖字段 */
  depValues: AnyObject
  /** 表单的全部的值 */
  allValues: AnyObject
  formRef: SchemaFormCtxType['formRef']
  /** 依赖字段缓存 */
  depFieldsCacheRef: ReadonlyRefObject<Map<string, FieldConfigType[]>>
  /** 依赖字段发生变化的key */
  changedDepKeys: string[]
  /** 依赖字段属性名 */
  depFieldsPropName?: string
  /** 表单元素的额外属性 */
  itemExtraElProps?: FormItemElWrapperProps['extraElProps']
  /** 父字段的数据索引 */
  parentDataIndex?: NormalizedDataIndexType
  /**
   * 标准化子字段
   * - 用于在复杂字段中额外处理子字段
   */
  normalizeChildField?: (field: FieldConfigType) => FieldConfigType
}

function dftNormalizeChildField(field: FieldConfigType) {
  return field
}

/**
 * 表单元素节点，是【表单字段定义】到【表单元素】转换过程的中间值
 * @desc 包含字段的原始定义，表单元素，以及表单元素的key
 */
export type FormTransformNode = {
  key: string
  // field: FormFieldConfigType
  elem: React.ReactElement | null
  props?: FormItemWrapperProps
}

/**
 * 表单字段映射器
 * @desc 将【表单字段定义】列表转换为【表单元素节点】列表
 */
export function FormFieldsMapper(props: FormFieldMapperProps) {
  const { fields, depValues, depFieldsCacheRef, changedDepKeys } = props

  const jsxElems: React.ReactElement[] = []
  const jsxElemMap: Record<string, React.ReactElement> = {}
  const transformNodeMap: Record<string, FormTransformNode> = {}

  // 处理dependency的辅助函数
  const processDependency = (field: FormFieldConfigType): FormFieldConfigType[] => {
    // 没有定义依赖，直接返回
    if (!field.dependency) return [field]

    const { depFieldsPropName = 'fields' } = props
    const { deps } = field.dependency
    const depFields = field.dependency[depFieldsPropName as 'fields']

    // 定义了dependency，但是 deps/fields 都没有定义，直接返回
    if (!deps && !depFields) {
      return [field]
    }

    // deps 必须是数组且不能为空
    if (!Array.isArray(deps) || deps.length === 0) {
      console.warn(`字段 ${field.key} 的 dependency.deps 必须是数组类型，且至少有一个依赖字段`)
      return [field]
    }

    // 检查是否有相关的依赖发生变化
    const hasRelevantChanges = deps.some((dep) => changedDepKeys.includes(dep))

    // 如果没有相关变化且缓存中有结果,则返回缓存的结果
    if (!hasRelevantChanges && depFieldsCacheRef.current.has(field.key)) {
      return depFieldsCacheRef.current.get(field.key) || []
    }

    // 获取依赖值
    const currentDepValues = pick(depValues, deps)

    // 优先处理 fields 依赖，如果存在则不处理 value 和 props
    if (depFields) {
      const _newFields = depFields(currentDepValues, {
        allValues: props.allValues,
        changedDepKeys,
        formRef: props.formRef,
        parentDataIndex: props.parentDataIndex,
      } as FormDependencyFieldsCtx)

      // 使用标准化函数处理一遍返回的新字段
      const newFields = _newFields.map(props.normalizeChildField || dftNormalizeChildField)

      // 缓存结果
      depFieldsCacheRef.current.set(field.key, newFields)

      // 递归处理新字段
      return newFields.flatMap(processDependency)
    }

    return [field]
  }

  const transformNodes: FormTransformNode[] = fields.flatMap((field) => {
    const processedFields = processDependency(field)
    return processedFields.map((field) => {
      const jsxElem = (
        <FormItemElWrapper
          // Item
          key={field.key}
          field={field}
          extraElProps={props.itemExtraElProps}
        />
      )
      const transformNode: FormTransformNode = {
        key: field.key,
        // field,
        props: field.wrapperProps,
        // 如果字段被配置为隐藏，则不渲染
        elem: field.control?.hidden ? null : jsxElem,
      }

      jsxElems.push(jsxElem)
      jsxElemMap[field.key] = jsxElem
      transformNodeMap[field.key] = transformNode

      return transformNode
    })
  })

  // 其实好像要不了这么多，暂时保留吧
  return {
    /** 原始的jsx元素 */
    jsxElems,
    /** 字段Key到原始的jsx元素映射 */
    jsxElemMap,
    /** 包含字段定义和转换后的jsx元素 */
    nodes: transformNodes,
    /** 字段Key到转换后的中间节点映射 */
    nodeMap: transformNodeMap,
  }
}

export type TransformedFormFields = ReturnType<typeof FormFieldsMapper>

// 待后面修改后删除
export type { React as _IGNORE_ME_REACT_TYPE_REFERENCE_ }
