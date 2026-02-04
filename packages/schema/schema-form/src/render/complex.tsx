import React from 'react'
import { GroupPanel } from '@hi-ui/group'
import { groupPredicates } from '@hi-ui/schema-core'
import type { FormGroupType, GroupConfigType } from '@hi-ui/schema-core'
import { TabsGroupRender } from './tabs'
import { GridGroupRender } from './grid'
import { cls } from '../_utils'

type ComplexGroupRenderProps = {
  group: GroupConfigType<FormGroupType>
  groupIndex: number
  /** 嵌套层级 */
  nestLevel?: number
}

export function ComplexGroupRender(props: ComplexGroupRenderProps) {
  const { group, groupIndex, nestLevel = 1 } = props

  if (groupPredicates.isCustom(group)) {
    return (
      <GroupPanel
        // GroupPanel
        group={group}
        actions={group.config.actions}
        className={cls('group-panel')}
        dataSet={{ nestLevel }}
      >
        {group.config.render()}
      </GroupPanel>
    )
  }

  if (groupPredicates.isTabs(group)) {
    return (
      <TabsGroupRender
        group={group as GroupConfigType<'tabs'>}
        groupIndex={groupIndex}
        nestLevel={nestLevel}
      />
    )
  }

  if (groupPredicates.isGrid(group)) {
    return (
      <GridGroupRender
        group={group as GroupConfigType<'grid'>}
        groupIndex={groupIndex}
        nestLevel={nestLevel}
      />
    )
  }

  return null
}
