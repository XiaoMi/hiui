import type { GroupConfigType, ChildGroupConfigType } from '@hi-ui/schema-core'

/** Tabs/Grid 子项可能是单组或带 groups 的容器，统一解析为 groups 数组 */
export function resolveChildGroups(child: ChildGroupConfigType): GroupConfigType[] {
  return (child.groups || [child]) as GroupConfigType[]
}
