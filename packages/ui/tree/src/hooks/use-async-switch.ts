import React, { useState, useCallback } from 'react'
import { FlattedTreeNodeData, TreeNodeData } from '../types'
import { useLatestRef } from './use-latest-ref'
import cloneDeep from 'lodash.clonedeep'
import { addChildrenById } from '../utils'
import { TreeNodeProps } from '../TreeNode'

export const useAsyncSwitch = (
  setTreeData: React.Dispatch<React.SetStateAction<TreeNodeData[]>>,
  onExpand?: (expandedNode: FlattedTreeNodeData, isExpanded: boolean) => void,
  onLoadChildren?: (node: FlattedTreeNodeData) => Promise<TreeNodeData[] | undefined>
) => {
  const [loadingIds, setLoadingIds] = useState<React.ReactText[]>([])

  // 加载节点
  const loadChildren = useCallback(
    async (node: FlattedTreeNodeData) => {
      if (!onLoadChildren) return

      const childrenNodes = await onLoadChildren(node)

      if (Array.isArray(childrenNodes)) {
        setTreeData((prev) => {
          const nextTreeData = cloneDeep(prev)
          addChildrenById(nextTreeData, node.id, childrenNodes)
          return nextTreeData
        })
      }
    },
    [onLoadChildren, setTreeData]
  )

  const onExpandRef = useLatestRef(onExpand)

  const onNodeSwitch = useCallback(
    async ({ data: node, expanded }: TreeNodeProps) => {
      const { id, children } = node

      if (children) {
        onExpandRef.current?.(node, !expanded)
        return
      }

      if (onLoadChildren) {
        setLoadingIds((prev) => (prev.indexOf(id) === -1 ? prev.concat(node.id) : prev))
        try {
          await loadChildren(node)
          // Using latest  onExpand function at nextTick
          window.requestAnimationFrame(() => {
            onExpandRef.current?.(node, !expanded)
          })

          setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id))
        } catch {
          setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id))
        }
      }
    },
    [loadChildren, onLoadChildren]
  )

  const isLoadingId = useCallback((id: React.ReactText) => loadingIds.indexOf(id) !== -1, [
    loadingIds,
  ])

  return [isLoadingId, onNodeSwitch] as const
}
