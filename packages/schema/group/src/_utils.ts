import { getBoolConfig, mergeProps } from '@hi-ui/schema-utils'
import type { CardProps } from '@hi-ui/card'
import type { CollapsePanelProps } from '@hi-ui/collapse'
import type { GroupConfigType } from '@hi-ui/schema-core'

export function getCollapseProps(group: GroupConfigType) {
  return getBoolConfig(
    group.control?.collapsible,
    {
      id: getGroupId(group),
      title: group.title,
    },
    { mergeDft: true }
  ) as CollapsePanelProps
}

export function getCardProps(group: GroupConfigType) {
  return mergeProps(
    {
      size: 'sm',
    },
    group.control?.extraCardProps
  ) as CardProps
}

export function getGroupId(group: GroupConfigType) {
  if (group.id) return group.id
  if (group._titleText) return group._titleText
  if (group.title != null) {
    try {
      return group.title.toString()
    } catch (error) {
      console.log('getGroupId', error)
      return ''
    }
  }
  return ''
}
