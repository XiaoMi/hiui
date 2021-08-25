import React, { useCallback, useMemo } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useLatestRef, useLatestCallback } from '@hi-ui/use-latest'
import { getNodeAncestors, findNestedChildIds } from '@hi-ui/tree-utils'
import { checkDefault } from './use-check'
import { UseCascadeCheckItem } from './types'

export const useCascadeCheck = ({
  cascaded,
  disabled,
  flattedData,
  defaultCheckedIds,
  checkedIdsProp,
  onCheck,
  allowCheck,
}: UseCascadeCheckProps) => {
  const onCheckRef = useLatestRef(onCheck)
  const proxyOnCheck = useCallback((checkedIds, checkedNode, checked, semiCheckedIds) => {
    onCheckRef.current?.({ checkedIds, semiCheckedIds }, checkedNode, checked)
  }, [])

  const [checkedIds, trySetCheckedIds] = useUncontrolledState(
    defaultCheckedIds,
    checkedIdsProp,
    proxyOnCheck
  )

  const checkedIdsSet = useMemo(() => new Set(checkedIds), [checkedIds])
  const isCheckedLatest = useLatestCallback((id: React.ReactText) => checkedIdsSet.has(id))

  // 注意：在非级联模式下，`semiCheckedIds`, `semiCheckedIdsSet` 状态值均为 `undefined`，避免性能浪费
  const [semiCheckedIds, semiCheckedIdsSet] = useMemo(
    () => (cascaded ? getSemiCheckedIdsWithSet(flattedData, isCheckedLatest) : []),
    [cascaded, isCheckedLatest, flattedData]
  )

  const isSemiCheckedLatest = useLatestCallback((id: React.ReactText) => {
    return cascaded ? semiCheckedIdsSet!.has(id) : false
  })

  const checkedIdsRef = useLatestRef(checkedIds)
  const semiCheckedIdsRef = useLatestRef(semiCheckedIds)

  const allowCheckRef = useLatestRef(allowCheck)

  const onNodeCheck = useCallback(
    (targetItem: UseCascadeCheckItem, shouldChecked: boolean) => {
      if (disabled) return
      if (allowCheckRef.current && allowCheckRef.current(targetItem) === false) return

      const checkedIds = checkedIdsRef.current

      if (cascaded) {
        const semiCheckedIds = semiCheckedIdsRef.current!
        const [nextCheckedIds, nextSemiCheckedIds] = checkCascade(
          checkedIds,
          semiCheckedIds,
          targetItem,
          shouldChecked
        )

        trySetCheckedIds(nextCheckedIds, targetItem, shouldChecked, nextSemiCheckedIds)
      } else {
        const nextCheckedIds = checkDefault(checkedIds, targetItem, shouldChecked)

        trySetCheckedIds(nextCheckedIds, targetItem, shouldChecked, [])
      }
    },
    [disabled, cascaded, trySetCheckedIds]
  )

  return [onNodeCheck, isCheckedLatest, isSemiCheckedLatest] as const
}

export interface UseCascadeCheckProps {
  cascaded: boolean
  disabled: boolean
  flattedData: UseCascadeCheckItem[]
  defaultCheckedIds: React.ReactText[]
  checkedIdsProp?: React.ReactText[]
  onCheck?: (
    checkedInfo: {
      checkedIds: React.ReactText[]
      semiCheckedIds: React.ReactText[]
    },
    node: UseCascadeCheckItem,
    checked: boolean
  ) => void
  allowCheck?: (targetItem: UseCascadeCheckItem) => boolean
}

/**
 * 级联多选，支持父子正反选操作
 */
export const checkCascade = (
  checkedIds: React.ReactText[],
  semiCheckedIds: React.ReactText[],
  checkedNode: UseCascadeCheckItem,
  checked: boolean
) => {
  const checkedIdsSet = new Set(checkedIds)
  const semiCheckedIdsSet = new Set(semiCheckedIds)

  const checkedNodeId = checkedNode.id
  const ancestors = getNodeAncestors(checkedNode)
  const childrenIds = findNestedChildIds(checkedNode)

  if (checked) {
    // - 对于选中节点自身的处理
    semiCheckedIdsSet.delete(checkedNodeId)
    checkedIdsSet.add(checkedNodeId)

    // - 对于选中节点的后代影响处理
    childrenIds.forEach((child) => {
      // 将未选中标记为选中态
      if (!checkedIdsSet.has(child)) {
        checkedIdsSet.add(child)
      }
      if (semiCheckedIdsSet.has(child)) {
        semiCheckedIdsSet.delete(child)
      }
    })

    // - 对于选中节点的祖先影响处理
    ancestors.forEach(({ id, children }) => {
      // 当该节点的子节点都被全选中时，则该节点为标记为全选，否则为半选
      if (!children?.some((child) => !checkedIdsSet.has(child.id))) {
        semiCheckedIdsSet.delete(id)
        checkedIdsSet.add(id)
      } else {
        semiCheckedIdsSet.add(id)
      }
    })
  } else {
    // - 对于取消选中节点自身的处理
    checkedIdsSet.delete(checkedNodeId)

    // - 对于取消选中节点对祖先的影响处理
    ancestors.forEach(({ id, children }) => {
      if (checkedIdsSet.has(id)) {
        checkedIdsSet.delete(id)
        semiCheckedIdsSet.add(id)
      }

      // 当该节点的子节点都未被选中时，则该节点为标记为未选中
      if (
        !children?.some((child) => checkedIdsSet.has(child.id) || semiCheckedIdsSet.has(child.id))
      ) {
        semiCheckedIdsSet.delete(id)
      }
    })

    // - 对于取消选中节点对后代的影响处理
    childrenIds.forEach((child) => {
      // 将选中标记为未选中态
      if (checkedIdsSet.has(child)) {
        checkedIdsSet.delete(child)
      }
      if (semiCheckedIdsSet.has(child)) {
        semiCheckedIdsSet.delete(child)
      }
    })
  }

  const nextCheckedIds = Array.from(checkedIdsSet)
  const nextSemiCheckedIds = Array.from(semiCheckedIdsSet)

  return [nextCheckedIds, nextSemiCheckedIds]
}

/**
 * 在 checkedIdsSet 为数据合法的情况下，查找所有的半选中态的节点 ids
 *
 * @param checkedIdsSet
 * @param flattedData
 * @returns
 */
export const getSemiCheckedIdsWithSet = (
  flattedData: UseCascadeCheckItem[],
  isChecked: (id: React.ReactText) => boolean
) => {
  const semiCheckedNodes = [] as UseCascadeCheckItem[]
  const semiCheckedIdsSet = new Set<React.ReactText>()

  let parentId: React.ReactText | undefined
  let parent: UseCascadeCheckItem | undefined

  flattedData.forEach((node) => {
    parent = node.parent
    if (parent) {
      parentId = parent.id
      if (semiCheckedIdsSet.has(parentId)) return

      // 父节点没选中，但是当前节点被选中，则视为半选
      if (!isChecked(parentId) && isChecked(node.id)) {
        semiCheckedIdsSet.add(parentId)
        semiCheckedNodes.push(parent)
      }
    }
  })

  // 自下而上设置半选态
  semiCheckedNodes.forEach((node) => {
    parent = node.parent
    while (parent) {
      parentId = parent.id
      // 可能存在兄弟节点，共同祖先需要去重，避免重复计算
      if (semiCheckedIdsSet.has(parentId)) return

      semiCheckedIdsSet.add(parentId)
      parent = parent.parent
    }
  })

  const semiCheckedIds = Array.from(semiCheckedIdsSet)
  return [semiCheckedIds, semiCheckedIdsSet] as const
}
