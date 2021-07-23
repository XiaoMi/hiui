import React, { useCallback, useMemo } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { TreeNodeData } from '../TreeNode'

export const useCheck = (
  flattedData: TreeNodeData[],
  defaultCheckedIds: React.ReactText[],
  checkedIdsProp?: React.ReactText[],
  onCheck?: (checkedIds: React.ReactText[], checkedNode: TreeNodeData, checked: boolean) => void
) => {
  const proxyOnCheck = useCallback(
    (checkedIds, checkedNode, checked, semiCheckedIds) => {
      onCheck?.(checkedIds, checkedNode, checked)
    },
    [onCheck]
  )

  // TODO: 用户传进来的数据都需要做一层去重（然后警告⚠️拦截）
  const [checkedIds, trySetCheckedIds] = useUncontrolledState(
    defaultCheckedIds,
    checkedIdsProp,
    proxyOnCheck
  )

  const checkedIdsSet = useMemo(() => new Set(checkedIds), [checkedIds])
  const [semiCheckedIds, semiCheckedIdsSet] = useMemo(
    () => getSemiCheckedIdsWithSet(checkedIdsSet, flattedData),
    [checkedIdsSet, flattedData]
  )

  const isCheckedId = useCallback(
    (id: React.ReactText) => {
      return checkedIdsSet.has(id)
    },
    [checkedIdsSet]
  )

  const isSemiCheckedId = useCallback(
    (id: React.ReactText) => {
      return semiCheckedIdsSet.has(id)
    },
    [semiCheckedIdsSet]
  )

  console.log('semiCheckedIds ---------- semiCheckedIdsSet', checkedIdsSet, semiCheckedIdsSet)

  const onNodeCheck = useCallback(
    (checkedNode: TreeNodeData, checked: boolean) => {
      const checkedIdsSet = new Set(checkedIds)
      const semiCheckedIdsSet = new Set(semiCheckedIds)

      const children = getChildrenNodeIds(checkedNode)
      const ancestors = getAncestorNodes(checkedNode)

      console.log('onCheckNode--------------', children, ancestors)

      if (checked) {
        // - 对于选中节点自身的处理
        semiCheckedIdsSet.delete(checkedNode.id)
        checkedIdsSet.add(checkedNode.id)

        // - 对于选中节点的后代影响处理
        children.forEach((child) => {
          // 将未选中标记为选中态
          if (!checkedIdsSet.has(child)) {
            checkedIdsSet.add(child)
          }
          if (semiCheckedIdsSet.has(child)) {
            semiCheckedIdsSet.delete(child)
          }
        })

        // - 对于选中节点的祖先影响处理
        ancestors.forEach((ancestor) => {
          // 当该节点的子节点都被全选中时，则该节点为标记为全选，否则为半选
          if (!ancestor.children?.some((child) => !checkedIdsSet.has(child.id))) {
            semiCheckedIdsSet.delete(ancestor.id)
            checkedIdsSet.add(ancestor.id)
          } else {
            semiCheckedIdsSet.add(ancestor.id)
          }
        })
      } else {
        // - 对于取消选中节点自身的处理
        checkedIdsSet.delete(checkedNode.id)

        // - 对于取消选中节点对祖先的影响处理
        ancestors.forEach((ancestor) => {
          if (checkedIdsSet.has(ancestor.id)) {
            checkedIdsSet.delete(ancestor.id)
            semiCheckedIdsSet.add(ancestor.id)
          }

          // 当该节点的子节点都未被选中时，则该节点为标记为未选中
          if (
            !ancestor.children?.some(
              (child) => checkedIdsSet.has(child.id) || semiCheckedIdsSet.has(child.id)
            )
          ) {
            semiCheckedIdsSet.delete(ancestor.id)
          }
        })

        // - 对于取消选中节点对后代的影响处理
        children.forEach((child) => {
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

      console.log('trySetCheckedIds', nextCheckedIds, nextSemiCheckedIds)
      trySetCheckedIds(nextCheckedIds, checkedNode, checked, nextSemiCheckedIds)
    },
    [checkedIds, trySetCheckedIds, semiCheckedIds]
  )

  return [isCheckedId, isSemiCheckedId, onNodeCheck] as const
}

/**
 * 寻找某一节点的所有祖先节点（顺序为树从下到上的层次）
 *
 * @param node
 * @returns
 */
const getAncestorNodes = (node: TreeNodeData) => {
  const ancestors = []

  let parentNode = node.parent
  while (parentNode) {
    ancestors.push(parentNode)
    parentNode = parentNode.parent
  }

  return ancestors
}

/**
 * 寻找某一节点的所有子节点的 ids
 *
 * @param node
 * @returns
 */
const getChildrenNodeIds = (node: TreeNodeData, childrenIds: React.ReactText[] = []) => {
  const { children } = node
  if (children) {
    children.forEach((child) => {
      childrenIds.push(child.id)
      getChildrenNodeIds(child, childrenIds)
    })
  }

  return childrenIds
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
  flattedData: TreeNodeData[]
) => {
  const semiCheckedNodes = [] as TreeNodeData[]
  const semiCheckedIdsSet = new Set<React.ReactText>()

  let parent: TreeNodeData | undefined
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
  console.log('getSemiCheckedIds', semiCheckedIdsSet, semiCheckedNodes)
  return [semiCheckedIds, semiCheckedIdsSet] as const
}
