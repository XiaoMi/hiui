import React, { useCallback, useState } from 'react'
import { useLatestCallback } from '@hi-ui/use-latest'
import cloneDeep from 'lodash.clonedeep'
import { CascaderItem, CascaderItemEventData } from '../types'
import { addChildrenById } from '@hi-ui/tree-utils'

export const useAsyncSwitch = (
  setCascaderData: React.Dispatch<React.SetStateAction<CascaderItem[]>>,
  onExpand?: (selectedOption: CascaderItemEventData) => void,
  onLoadChildren?: (item: CascaderItemEventData) => Promise<CascaderItem[] | void> | void
) => {
  const [loadingIds, addLoadingIds, removeLoadingIds] = useList<React.ReactText>()

  // 加载节点
  const loadChildren = useCallback(
    async (node: CascaderItemEventData) => {
      if (!onLoadChildren) return

      const childrenNodes = await onLoadChildren(node)

      if (Array.isArray(childrenNodes)) {
        setCascaderData((prev) => {
          const nextTreeData = cloneDeep(prev)
          addChildrenById(nextTreeData, node.id, childrenNodes)
          return nextTreeData
        })
      }
    },
    [onLoadChildren, setCascaderData]
  )

  const onExpandLatest = useLatestCallback(onExpand)

  const onNodeSwitch = useCallback(
    async (node: CascaderItemEventData) => {
      console.log(node)

      const { id, children, isLeaf } = node

      if (children) {
        onExpandLatest(node)
        return
      }

      if (isLeaf) {
        return
      }

      if (onLoadChildren) {
        addLoadingIds(id)
        try {
          await loadChildren(node)
          // Using latest  onExpand function at nextTick
          window.requestAnimationFrame(() => {
            onExpandLatest(node)
          })
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
