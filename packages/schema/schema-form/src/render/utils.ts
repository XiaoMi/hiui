import type { GroupConfigType, ChildGroupConfigType } from '@hi-ui/schema-core'
import type { GroupedNestFields } from './ctx'

type MatchGroupsAndFieldsCtxType = {
  childGroup: ChildGroupConfigType
  childIndex: number
  groupedFields: GroupedNestFields
}

export function matchGroupsAndFields(ctx: MatchGroupsAndFieldsCtxType) {
  const groups = (ctx.childGroup.groups || [ctx.childGroup]) as GroupConfigType<'simple'>[]

  const childGroupedFields = ctx.groupedFields.groups[ctx.childIndex]
  const groupedFields =
    'groups' in childGroupedFields ? childGroupedFields.groups : [childGroupedFields]

  return {
    groups,
    groupedFields,
  }
}
