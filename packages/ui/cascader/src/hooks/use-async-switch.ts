import React, { useCallback } from 'react'
import { useLatestCallback } from '@hi-ui/use-latest'
import { CascaderItem, CascaderItemEventData } from '../types'
import { addChildrenById, cloneTree, getTopDownAncestors } from '@hi-ui/tree-utils'
import { useCheckState } from '@hi-ui/use-check-state'

export const useAsyncSwitch = (
  setCascaderData: React.Dispatch<React.SetStateAction<CascaderItem[]>>,
  onExpand?: (selectedOption: CascaderItemEventData, onlyExpand: boolean) => void,
  onLoadChildren?: (
    item: CascaderItemEventData,
    idPaths: React.ReactText[]
  ) => Promise<CascaderItem[] | void> | void
) => {
  const onLoadChildrenLatest = useLatestCallback(onLoadChildren)

  // 加载节点
  const loadChildren = useCallback(
    async (node: CascaderItemEventData) => {
      const childrenNodes = await onLoadChildrenLatest(
        node,
        getTopDownAncestors(node).map(({ id }) => id)
      )

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

  const { has: isLoadingId, add: addLoadingIds, remove: removeLoadingIds } = useCheckState()
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

  return [isLoadingId, onNodeSwitch] as const
}
