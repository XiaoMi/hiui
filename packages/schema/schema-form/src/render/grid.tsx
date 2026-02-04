import React from 'react'
import { GridHelper } from '@hi-ui/schema-auto-grid'
import { GroupContainer, GroupPanel, getGroupId } from '@hi-ui/group'
import type { GridHelperProps } from '@hi-ui/schema-auto-grid'
import type { GroupConfigType } from '@hi-ui/schema-core'
import { useSchemaFormCtx } from '../ctx'
import { cls } from '../_utils'
import { GroupedSchemaFormRender, type BasicRenderProps } from './index'
import { GroupedNestFields, useRenderCtx } from './ctx'
import { matchGroupsAndFields } from './utils'

type GridRenderProps = {
  group: GroupConfigType<'grid'>
  groupIndex: number
  nestLevel?: BasicRenderProps['nestLevel']
}

export function GridGroupRender(props: GridRenderProps) {
  const { group, nestLevel = 1 } = props
  const { propsRef } = useSchemaFormCtx()
  const config = group.config
  const ctxGroupedFields = useRenderCtx().groupedFieldsRef.current
  const selfGroupedFields = ctxGroupedFields[props.groupIndex] as GroupedNestFields

  const nodes: GridHelperProps['nodes'] = config.children?.map((child, childIndex) => {
    const { groups, groupedFields } = matchGroupsAndFields({
      childGroup: child,
      childIndex,
      groupedFields: selfGroupedFields,
    })

    const elem = (
      <GroupContainer
        groups={groups}
        className={cls('grid-col_container')}
        bordered={propsRef.current.borderedGroups}
        collapseProps={propsRef.current.collapseProps}
      >
        <GroupedSchemaFormRender
          groups={groups}
          groupedFields={groupedFields}
          nestLevel={nestLevel + 1}
        />
      </GroupContainer>
    )

    return {
      key: getGroupId(child),
      elem,
      props: child.wrapperProps,
    }
  })

  return (
    <GroupPanel
      group={group}
      actions={config.actions}
      className={cls('group-panel')}
      dataSet={{ nestLevel }}
    >
      <GridHelper
        nodes={nodes}
        columnCount={config.columnCount}
        gutter={config.gutter ?? 12}
        rowGap={config.rowGap ?? 12}
        {...config.props}
      ></GridHelper>
    </GroupPanel>
  )
}
