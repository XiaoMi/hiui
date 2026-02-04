import React from 'react'
import { GridHelper, DynamicColumnCountInjector, extractGridProps } from '@hi-ui/auto-grid'
import { GroupContainer, GroupPanel } from '@hi-ui/group'
import { groupPredicates } from '@hi-ui/schema-core'
import type { GroupConfigType } from '@hi-ui/schema-core'
import { useSchemaFormCtx } from '../ctx'
import { useGroupAndFields } from '../fields'
import { cls } from '../_utils'
import type { EnhancedFormRefType } from '../ref'
import type { TransformedFormFields } from '../item/mapper'
import type { SchemaFormProps } from '../form'
import { ComplexGroupRender } from './complex'
import { SchemaFormRenderCtxProvider, useRenderCtx } from './ctx'
import type { GroupedFieldsType } from './ctx'

export type BasicRenderProps = {
  formFields: TransformedFormFields
  group: GroupConfigType
  /** 嵌套层级 */
  nestLevel?: number
}

function BasicSchemaFormRender(renderProps: BasicRenderProps) {
  const { formRef, propsRef, gridWrapperElRef } = useSchemaFormCtx<AnyObject>()
  const { formFields } = renderProps

  // 自定义布局
  const customFormContent = propsRef.current.renderFormContent
  if (customFormContent) {
    return customFormContent(formFields, { formRef, group: renderProps.group })
  }

  // 网格布局
  const enableGrid = propsRef.current.grid ?? true
  if (enableGrid) {
    const { injectorProps, gridProps } = extractGridProps(propsRef.current.gridProps)

    return (
      <DynamicColumnCountInjector
        // injector
        {...injectorProps}
        wrapperElRef={gridWrapperElRef.current}
      >
        <GridHelper
          // grid
          {...gridProps}
          nodes={formFields.nodes}
        />
      </DynamicColumnCountInjector>
    )
  }

  // 单体布局
  return <>{formFields.jsxElems}</>
}

type GroupedRenderProps = {
  groups: NonNullable<SchemaFormProps['groups']>
  groupedFields?: GroupedFieldsType[]
  /** 嵌套层级 */
  nestLevel?: number
}

export type FormGroupActionCtxType = {
  formRef: EnhancedFormRefType
}

export function GroupedSchemaFormRender(props: GroupedRenderProps) {
  const { formRef } = useSchemaFormCtx()
  const { groups, nestLevel = 1 } = props
  const ctxGroupedFields = useRenderCtx().groupedFieldsRef.current
  // props 中存在时用传入的，否则用 context 的
  const groupedFields = props.groupedFields ?? ctxGroupedFields

  const children = groups.map((group, index) => {
    // 不是简单组，不是可编辑表格组，则认为是复杂组
    // 简单组只有字段，可以直接渲染
    // 可编辑表格在表单中需要绑定字段，也认为是简单组，可以直接渲染
    // 可编辑表格的转换魔法在 genGroupedFields 中，可自行去查看
    if (!groupPredicates.isSimple(group) && !groupPredicates.isEditTable(group)) {
      if (groupPredicates.isValidFormGroup(group)) {
        return (
          <ComplexGroupRender
            // index
            key={index}
            groupIndex={index}
            group={group}
            nestLevel={nestLevel}
          />
        )
      }

      return null
    }

    const config = group.config // 没有别的操作了其实
    if (groupedFields[index]?.type !== 'fields') return null
    const formFields = groupedFields[index].fields
    return (
      <GroupPanel
        key={index}
        group={group}
        actions={config.actions}
        ctx={{ formRef } as FormGroupActionCtxType}
        dataSet={{ nestLevel }}
        className={cls('group-panel')}
      >
        <BasicSchemaFormRender formFields={formFields} group={group} />
      </GroupPanel>
    )
  })

  return <>{children}</>
}

export function SchemaFormRender() {
  const { propsRef } = useSchemaFormCtx()
  const { groups, groupedFields } = useGroupAndFields()

  // 理论上走不到这里，留着作为兜底
  if (!groups?.length) return <></>

  // 只有一组，且这一组是从单独的 fields 中转换来的
  // @ts-expect-error fromNormalized 是 GroupConfig 的非标准字段
  if (groups.length === 1 && groups[0].fromNormalized && groupedFields[0].type === 'fields') {
    const group = groups[0]
    const formFields = groupedFields[0].fields
    return <BasicSchemaFormRender formFields={formFields} group={group} />
  }

  // 其他情况，使用分组渲染
  return (
    <SchemaFormRenderCtxProvider groupedFields={groupedFields}>
      <GroupContainer
        groups={groups}
        className={cls('group-container')}
        bordered={propsRef.current.borderedGroups}
        collapseProps={propsRef.current.collapseProps}
      >
        <GroupedSchemaFormRender groups={groups} />
      </GroupContainer>
    </SchemaFormRenderCtxProvider>
  )
}
