import React, { useCallback, useMemo } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useLatestRef } from '@hi-ui/use-latest'
import { getNodeAncestors, findNestedChildren } from '@hi-ui/tree-utils'
import { checkDefault } from './use-check'
import { UseCascadeCheckItem } from './types'

export const useCascadeCheck = ({
  cascaded,
  disabled,
  flattedData,
  defaultCheckedIds,
  checkedIds: checkedIdsProp,
  onCheck,
  allowCheck,
}: UseCascadeCheckProps) => {
  const onCheckRef = useLatestRef(onCheck)
  const allowCheckRef = useLatestRef(allowCheck)

  const proxyOnCheck = useCallback((checkedIds, checkedNode, shouldChecked, semiCheckedIds) => {
    onCheckRef.current?.({ checkedIds, semiCheckedIds }, checkedNode, shouldChecked)
  }, [])

  const [checkedIds, trySetCheckedIds] = useUncontrolledState(
    defaultCheckedIds,
    checkedIdsProp,
    proxyOnCheck
  )

  const checkedIdsSet = useMemo(() => new Set(checkedIds), [checkedIds])
  const isCheckedId = useCallback((id: React.ReactText) => checkedIdsSet.has(id), [checkedIdsSet])

  // 注意：在非级联模式下，`semiCheckedIds`, `semiCheckedIdsSet` 状态值均为 `undefined`，避免性能浪费
  const [semiCheckedIds, semiCheckedIdsSet] = useMemo(
    () =>
      cascaded ? getSemiCheckedIdsWithSet(flattedData, isCheckedId, allowCheckRef.current) : [],
    [cascaded, isCheckedId, flattedData]
  )

  const isSemiCheckedId = useCallback(
    (id: React.ReactText) => {
      return cascaded ? semiCheckedIdsSet!.has(id) : false
    },
    [cascaded, semiCheckedIdsSet]
  )

  const checkedIdsRef = useLatestRef(checkedIds)
  const semiCheckedIdsRef = useLatestRef(semiCheckedIds)

  const onNodeCheck = useCallback(
    (targetItem: UseCascadeCheckItem, shouldChecked: boolean) => {
      if (disabled) return
      if (allowCheckRef.current && !allowCheckRef.current(targetItem)) return

      const checkedIds = checkedIdsRef.current

      if (cascaded) {
        const semiCheckedIds = semiCheckedIdsRef.current!
        const [nextCheckedIds, nextSemiCheckedIds] = checkCascade(
          checkedIds,
          semiCheckedIds,
          targetItem,
          shouldChecked,
          allowCheckRef.current
        )

        trySetCheckedIds(nextCheckedIds, targetItem, shouldChecked, nextSemiCheckedIds)
      } else {
        const nextCheckedIds = checkDefault(checkedIds, targetItem, shouldChecked)

        trySetCheckedIds(nextCheckedIds, targetItem, shouldChecked, [])
      }
    },
    [disabled, cascaded, trySetCheckedIds]
  )

  return [onNodeCheck, isCheckedId, isSemiCheckedId] as const
}

export interface UseCascadeCheckProps<T = any> {
  cascaded: boolean
  disabled: boolean
  flattedData: UseCascadeCheckItem[]
  defaultCheckedIds: React.ReactText[]
  checkedIds?: React.ReactText[]
  onCheck?: (
    checkedInfo: {
      checkedIds: React.ReactText[]
      semiCheckedIds: React.ReactText[]
    },
    targetItem: T,
    shouldChecked: boolean
  ) => void
  allowCheck?: (targetItem: T) => boolean
}

const ALWAYS_ALLOW = () => true

/**
 * 级联多选，支持父子正反选操作
 */
export const checkCascade = (
  checkedIds: React.ReactText[],
  semiCheckedIds: React.ReactText[],
  checkedNode: UseCascadeCheckItem,
  shouldChecked: boolean,
  allowCheck: (targetItem: UseCascadeCheckItem) => boolean = ALWAYS_ALLOW
) => {
  const checkedIdsSet = new Set(checkedIds)
  const semiCheckedIdsSet = new Set(semiCheckedIds)

  const checkedNodeId = checkedNode.id
  const ancestors = getNodeAncestors(checkedNode, allowCheck)
  const nestedChildren = findNestedChildren(checkedNode, allowCheck)

  if (shouldChecked) {
    // - 对于选中节点自身的处理
    semiCheckedIdsSet.delete(checkedNodeId)
    checkedIdsSet.add(checkedNodeId)

    // - 对于选中节点的后代影响处理
    nestedChildren.forEach((child) => {
      const { id } = child

      // 将未选中标记为选中态
      if (!checkedIdsSet.has(id)) {
        checkedIdsSet.add(id)
      }
      if (semiCheckedIdsSet.has(id)) {
        semiCheckedIdsSet.delete(id)
      }
    })

    // - 对于选中节点的祖先影响处理
    ancestors.forEach((ancestor) => {
      const { id, children } = ancestor

      // 当该节点的子节点都被全选中时，则该节点为标记为全选，否则为半选
      if (children!.filter(allowCheck).some((child) => !checkedIdsSet.has(child.id)) === false) {
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
    ancestors.forEach((ancestor) => {
      const { id, children } = ancestor

      if (checkedIdsSet.has(id)) {
        checkedIdsSet.delete(id)
        semiCheckedIdsSet.add(id)
      }

      // 当该节点的子节点都未被选中时，则该节点为标记为未选中
      if (
        children!
          .filter(allowCheck)
          .some((child) => checkedIdsSet.has(child.id) || semiCheckedIdsSet.has(child.id)) === false
      ) {
        semiCheckedIdsSet.delete(id)
      }
    })

    // - 对于取消选中节点对后代的影响处理
    nestedChildren.forEach((child) => {
      const { id } = child

      // 将选中标记为未选中态
      if (checkedIdsSet.has(id)) {
        checkedIdsSet.delete(id)
      }
      if (semiCheckedIdsSet.has(id)) {
        semiCheckedIdsSet.delete(id)
      }
    })
  }

  const nextCheckedIds = Array.from(checkedIdsSet)
  const nextSemiCheckedIds = Array.from(semiCheckedIdsSet)

  return [nextCheckedIds, nextSemiCheckedIds] as const
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
  isChecked: (id: React.ReactText) => boolean,
  allowCheck: (targetItem: UseCascadeCheckItem) => boolean = ALWAYS_ALLOW
) => {
  const semiCheckedNodes = [] as UseCascadeCheckItem[]
  const semiCheckedIdsSet = new Set<React.ReactText>()

  let parentId: React.ReactText | undefined
  let parent: UseCascadeCheckItem | undefined

  flattedData.forEach((node) => {
    parent = node.parent

    if (parent && parent.id !== undefined) {
      if (!allowCheck(parent)) return

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
    while (parent && parent.id !== undefined) {
      if (!allowCheck(parent)) return

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
