import type { GroupConfigType, ChildGroupConfigType } from '@hi-ui/schema-core'
import type { GroupedNestFields } from './ctx'

/** Tabs/Grid 子项可能是单组或带 groups 的容器，统一解析为 groups 数组 */
export function resolveChildGroups(child: ChildGroupConfigType): GroupConfigType[] {
  return (child.groups || [child]) as GroupConfigType[]
}

type MatchGroupsAndFieldsCtxType = {
  childGroup: ChildGroupConfigType
  childIndex: number
  groupedFields: GroupedNestFields
}

export function matchGroupsAndFields(ctx: MatchGroupsAndFieldsCtxType) {
  const groups = resolveChildGroups(ctx.childGroup) as GroupConfigType<'simple'>[]

  const childGroupedFields = ctx.groupedFields.groups[ctx.childIndex]
  const groupedFields =
    'groups' in childGroupedFields ? childGroupedFields.groups : [childGroupedFields]

  return {
    groups,
    groupedFields,
  }
}
