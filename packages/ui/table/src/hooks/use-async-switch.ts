import React, { useCallback } from 'react'
import { useLatestCallback } from '@hi-ui/use-latest'
import { TableRowEventData } from '../types'
import { addChildrenById, cloneTree } from '@hi-ui/tree-utils'
import { useCheckState } from '@hi-ui/use-check-state'

export const useAsyncSwitch = ({
  setCascaderData,
  onExpand,
  onLoadChildren,
  fieldKey = 'key',
}: {
  setCascaderData: React.Dispatch<React.SetStateAction<any[]>>
  onExpand?: (selectedOption: TableRowEventData, onlyExpand: boolean) => void
  onLoadChildren?: (item: TableRowEventData) => Promise<any[] | void> | void
  fieldKey?: string
}) => {
  const onLoadChildrenLatest = useLatestCallback(onLoadChildren)

  // 加载节点
  const loadChildren = useCallback(
    async (node: TableRowEventData) => {
      const childrenNodes = await onLoadChildrenLatest(node)

      if (Array.isArray(childrenNodes)) {
        setCascaderData((prev) => {
          const nextTreeData = cloneTree(prev)
          addChildrenById(nextTreeData, node.id, childrenNodes, fieldKey)

          return nextTreeData
        })
      }
    },
    [fieldKey, onLoadChildrenLatest, setCascaderData]
  )

  const { state: loadingIds, add: addLoadingIds, remove: removeLoadingIds } = useCheckState<
    React.ReactText
  >()
  const onExpandLatest = useLatestCallback(onExpand)

  const onNodeSwitch = useCallback(
    async (node: TableRowEventData, onlyExpand = false) => {
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
