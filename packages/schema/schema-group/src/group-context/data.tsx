import React from 'react'
import { get } from 'lodash-es'

type GroupDataCtxType = {
  dataSource: AnyObject
}

const GroupDataCtx = React.createContext<GroupDataCtxType>(null as unknown as GroupDataCtxType)

export function GroupDataProvider(props: React.PropsWithChildren<GroupDataCtxType>) {
  const { children, dataSource } = props
  return <GroupDataCtx.Provider value={{ dataSource }}>{children}</GroupDataCtx.Provider>
}

export function useGroupData() {
  const ctx = React.useContext(GroupDataCtx)
  if (!ctx) return {} as GroupDataCtxType
  return ctx
}

export function useGroupFieldData(dataIndex?: string, opts: Partial<GroupDataCtxType> = {}) {
  const ctx = React.useContext(GroupDataCtx)

  // dataSource 存在则直接使用
  if (opts.dataSource) return opts.dataSource

  // 随后才尝试从 ctx 中获取
  if (!ctx) return undefined
  if (!dataIndex) return undefined
  return get(ctx.dataSource, dataIndex)
}
