import React, { useCallback, useMemo } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { CheckCascaderItemEventData, FlattedCheckCascaderItem } from '../types'
import { useLatestRef } from '@hi-ui/use-latest'
import { findNestedChildIds, getNodeAncestors } from '../utils'

export const useCheck = (
  cascaded: boolean,
  disabled: boolean,
  flattedData: FlattedCheckCascaderItem[],
  defaultCheckedIds: React.ReactText[],
  checkedIdsProp?: React.ReactText[],
  onCheck?: (
    checkedInfo: {
      checkedIds: React.ReactText[]
      semiCheckedIds: React.ReactText[]
    },
    node: CheckCascaderItemEventData,
    checked: boolean
  ) => void
) => {
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

  // 注意：在非级联模式下，`semiCheckedIds`, `semiCheckedIdsSet` 状态值均为 `undefined`，避免性能浪费
  const [semiCheckedIds, semiCheckedIdsSet] = useMemo(
    () => (cascaded ? getSemiCheckedIdsWithSet(checkedIdsSet, flattedData) : []),
    [cascaded, checkedIdsSet, flattedData]
  )

  const isCheckedId = (id: React.ReactText) => checkedIdsSet.has(id)
  const isSemiCheckedId = (id: React.ReactText) => (cascaded ? semiCheckedIdsSet!.has(id) : false)

  const checkedIdsRef = useLatestRef(checkedIds)
  const semiCheckedIdsRef = useLatestRef(semiCheckedIds)

  const onNodeCheck = useCallback(
    (targetNode: CheckCascaderItemEventData, shouldChecked: boolean) => {
      if (
        disabled ||
        targetNode.disabled ||
        targetNode.disabledCheckbox ||
        targetNode.checkable === false
      ) {
        return
      }

      const checkedIds = checkedIdsRef.current

      if (cascaded) {
        const semiCheckedIds = semiCheckedIdsRef.current!
        const [nextCheckedIds, nextSemiCheckedIds] = checkCascade(
          checkedIds,
          semiCheckedIds,
          targetNode,
          shouldChecked
        )

        trySetCheckedIds(nextCheckedIds, targetNode, shouldChecked, nextSemiCheckedIds)
      } else {
        const nextCheckedIds = checkDefault(checkedIds, targetNode, shouldChecked)

        trySetCheckedIds(nextCheckedIds, targetNode, shouldChecked, [])
      }
    },
    [disabled, cascaded, trySetCheckedIds]
  )

  return [onNodeCheck, isCheckedId, isSemiCheckedId] as const
}

/**
 * 普通多选
 */
const checkDefault = (
  checkedIds: React.ReactText[],
  targetItem: CheckCascaderItemEventData,
  shouldChecked: boolean
) => {
  let nextCheckedIds = checkedIds
  const targetId = targetItem.id

  if (shouldChecked) {
    if (nextCheckedIds.indexOf(targetId) === -1) {
      nextCheckedIds = nextCheckedIds.concat(targetId)
    }
  } else {
    nextCheckedIds = nextCheckedIds.filter((item) => item !== targetId)
  }

  return nextCheckedIds
}

/**
 * 级联多选，支持父子正反选操作
 */
const checkCascade = (
  checkedIds: React.ReactText[],
  semiCheckedIds: React.ReactText[],
  checkedNode: CheckCascaderItemEventData,
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
const getSemiCheckedIdsWithSet = (
  checkedIdsSet: Set<React.ReactText>,
  flattedData: FlattedCheckCascaderItem[]
) => {
  const semiCheckedNodes = [] as FlattedCheckCascaderItem[]
  const semiCheckedIdsSet = new Set<React.ReactText>()

  let parent: FlattedCheckCascaderItem | undefined
  let parentId: React.ReactText | undefined

  flattedData.forEach((node) => {
    parent = node.parent
    if (parent) {
      parentId = parent.id
      if (semiCheckedIdsSet.has(parentId)) return

      // 父节点没选中，但是当前节点被选中，则视为半选
      if (!checkedIdsSet.has(parentId) && checkedIdsSet.has(node.id)) {
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
