import React from 'react'
import type { GroupConfigType } from '@hi-ui/schema-core'
import type { GroupMapType } from './index'

const GroupMapCtx = React.createContext<GroupMapType>(null as unknown as GroupMapType)

export function GroupMapProvider(
  props: React.PropsWithChildren<{ groups: Partial<GroupMapType> }>
) {
  const { children, groups } = props
  return <GroupMapCtx.Provider value={groups as GroupMapType}>{children}</GroupMapCtx.Provider>
}

function NoopFallback() {
  return <div>NoopFallback</div>
}

export type UseGroupMapOpts = {
  /** 自定义组渲染器映射配置 */
  groupMap?: Partial<GroupMapType>
}

export function useGroupMap(opts: UseGroupMapOpts = {}) {
  const ctx = React.useContext(GroupMapCtx)
  const { groupMap } = opts

  if (groupMap) return groupMap as GroupMapType

  if (!ctx) {
    console.warn(`SchemaGroup: 未找到 FieldsContext`)
    // TODO: 这里需要一个默认的渲染器
    // eslint-disable-next-line react/display-name
    return { text: () => <div>text</div> } as unknown as GroupMapType
  }
  return ctx
}

export type MatchGroupRendererOpts = Omit<UseGroupMapOpts, 'groupMap'> & {
  name?: string
  group: GroupConfigType
  groupMap: GroupMapType // 必传，此处已经必须有明确的 fieldMap
}

export function matchGroupRenderer(opts: MatchGroupRendererOpts) {
  const { group, groupMap } = opts

  const matchedGroup = groupMap[group.type as keyof GroupMapType]
  const GroupRenderer = matchedGroup || NoopFallback
  if (!matchedGroup) {
    const _name = opts.name || 'matchGroupRenderer'
    const _type = group.type
    // TODO: 这里需要一个默认的渲染器
    console.warn(`${_name}: 未找到 GroupType "${_type}" 对应的渲染器`)
  }

  return GroupRenderer
}

export type UseMatchGroupRendererOpts = Omit<MatchGroupRendererOpts, 'groupMap'> & {
  groupMap?: GroupMapType // 非必传，也可由内部上下文提供
}

export function useMatchGroupRenderer(opts: UseMatchGroupRendererOpts) {
  // 获取字段渲染器
  const groupMap = useGroupMap(opts)
  return matchGroupRenderer({ ...opts, groupMap })
}
