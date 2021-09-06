import React, { useCallback, useState } from 'react'
import { useLatestCallback } from '@hi-ui/use-latest'
import { CascaderItem, CascaderItemEventData } from '../types'
import { addChildrenById, cloneTree } from '@hi-ui/tree-utils'

export const useAsyncSwitch = (
  setCascaderData: React.Dispatch<React.SetStateAction<CascaderItem[]>>,
  onExpand?: (selectedOption: CascaderItemEventData, onlyExpand: boolean) => void,
  onLoadChildren?: (item: CascaderItemEventData) => Promise<CascaderItem[] | void> | void
) => {
  const onLoadChildrenLatest = useLatestCallback(onLoadChildren)

  // 加载节点
  const loadChildren = useCallback(
    async (node: CascaderItemEventData) => {
      const childrenNodes = await onLoadChildrenLatest(node)

      if (Array.isArray(childrenNodes)) {
        setCascaderData((prev) => {
          const nextTreeData = cloneTree(prev)
          addChildrenById(nextTreeData, node.id, childrenNodes)
          return nextTreeData
        })
      }
    },
    [onLoadChildrenLatest, setCascaderData]
  )

  const [loadingIds, addLoadingIds, removeLoadingIds] = useList<React.ReactText>()
  const onExpandLatest = useLatestCallback(onExpand)

  const onNodeSwitch = useCallback(
    async (node: CascaderItemEventData, onlyExpand = false) => {
      // 直接触发选中该节点
      onExpandLatest(node, onlyExpand)

      const { id, children, isLeaf } = node

      if (children) {
        return
      }

      if (isLeaf) {
        return
      }

      if (onLoadChildren) {
        addLoadingIds(id)
        try {
          await loadChildren(node)
          removeLoadingIds(id)
        } catch {
          removeLoadingIds(id)
        }
      }
    },
    [loadChildren, onLoadChildren, onExpandLatest, addLoadingIds, removeLoadingIds]
  )

  const isLoadingId = (id: React.ReactText) => loadingIds.indexOf(id) !== -1

  return [isLoadingId, onNodeSwitch] as const
}

const useList = <T>(initialValue: T[] = []) => {
  const [keyList, setKeyList] = useState<T[]>(initialValue)

  const remove = useCallback((targetKey: T) => {
    setKeyList((prev) => prev.filter((key) => key !== targetKey))
  }, [])

  const add = useCallback((targetKey: T) => {
    setKeyList((prev) => (prev.indexOf(targetKey) === -1 ? prev.concat(targetKey) : prev))
  }, [])

  return [keyList, add, remove] as const
}
