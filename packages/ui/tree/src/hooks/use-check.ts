import React, { useCallback, useMemo } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import _ from 'lodash'
import { TreeNodeData } from '../TreeNode'

export const useCheck = (
  flattedData: TreeNodeData[],
  defaultCheckedIds: React.ReactText[],
  checkedIdsProp?: React.ReactText[],
  onCheck?: (checkedIds: React.ReactText[], checkedNode: TreeNodeData, checked: boolean) => void
) => {
  const proxyOnCheck = useCallback(
    (
      checkedIds: React.ReactText[],
      checkedNode: TreeNodeData,
      checked: boolean,
      semiCheckedIds: React.ReactText[]
    ) => {
      onCheck?.(checkedIds, checkedNode, checked)
    },
    [onCheck]
  )

  const [checkedIds, trySetCheckedIds] = useUncontrolledState(
    defaultCheckedIds,
    checkedIdsProp,
    proxyOnCheck
  )

  const semiCheckedIds = useMemo(() => getSemiChecked(new Set(checkedIds), flattedData), [
    checkedIds,
    flattedData,
  ])
  console.log('semiCheckedIds', semiCheckedIds)

  const onNodeCheck = useCallback(
    (checkedNode: TreeNodeData, checked: boolean) => {
      let nextCheckedIds = [...checkedIds]
      const checkedIdsSet = new Set(nextCheckedIds)

      let semiCheckedIds = getSemiChecked(checkedIdsSet, flattedData)
      const semiCheckedIdsSet = new Set(semiCheckedIds)

      const children = getChildrenNodeIds(checkedNode)
      const ancestors = getAncestorNodes(checkedNode)

      console.log(
        'onCheckNode--------------',
        children,
        ancestors,
        checkedIdsSet,
        semiCheckedIdsSet
      )

      if (checked) {
        // - 对于选中节点的后代影响处理
        children.forEach((child) => {
          // 将未选中标记为选中态
          if (!checkedIdsSet.has(child)) {
            checkedIdsSet.add(child)
          }

          // 维护半选中列表
          if (semiCheckedIdsSet.has(child)) {
            semiCheckedIdsSet.delete(child)
          }
        })

        // - 对于选中节点自身的处理
        semiCheckedIdsSet.delete(checkedNode.id)
        checkedIdsSet.add(checkedNode.id)

        // - 对于选中节点的祖先影响处理
        ancestors.forEach((ancestor) => {
          // 子节点都选中，则该节点为标记为全选，否则为半选
          if (ancestor.children?.every((child) => checkedIdsSet.has(child.id))) {
            semiCheckedIdsSet.delete(ancestor.id)
            checkedIdsSet.add(ancestor.id)
          } else {
            semiCheckedIdsSet.add(ancestor.id)
          }
        })
      } else {
        // - 对于取消选中节点自身的处理
        checkedIdsSet.delete(checkedNode.id)

        // - 取消选中节点对祖先的影响处理
        ancestors.forEach((ancestor) => {
          if (checkedIdsSet.has(ancestor.id)) {
            checkedIdsSet.delete(ancestor.id)
            semiCheckedIdsSet.add(ancestor.id)
          }

          // 当该节点的孩子都是非选中时，需要变成未选中状态
          if (
            ancestor.children?.every(
              (child) => !checkedIdsSet.has(child.id) && !semiCheckedIdsSet.has(child.id)
            )
          ) {
            semiCheckedIdsSet.delete(ancestor.id)
          }
        })

        // - 取消选中节点对后代的影响处理
        children.forEach((child) => {
          if (checkedIdsSet.has(child)) {
            checkedIdsSet.delete(child)
          }

          if (semiCheckedIdsSet.has(child)) {
            semiCheckedIdsSet.delete(child)
          }
        })
      }

      nextCheckedIds = Array.from(checkedIdsSet)
      // TODO: 存在bug，数据存在异常
      semiCheckedIds = Array.from(semiCheckedIdsSet)

      console.log('trySetCheckedIds', nextCheckedIds, semiCheckedIds)
      trySetCheckedIds(nextCheckedIds, checkedNode, checked, semiCheckedIds)
    },
    [checkedIds, trySetCheckedIds, flattedData]
  )

  return [checkedIds, semiCheckedIds, onNodeCheck] as const
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
  const children = node.children

  if (children) {
    children.forEach((child) => {
      childrenIds.push(child.id)
      getChildrenNodeIds(child, childrenIds)
    })
  }

  return childrenIds
}

const getSemiChecked = (checkedIdsSet: Set<React.ReactText>, flattedData: TreeNodeData[]) => {
  // 对所有选中节点的祖先节点进行半选（如果其兄弟存在未选中）

  const semiCheckedParentIds = [] as TreeNodeData[]

  flattedData.forEach((node) => {
    // 父节点没选中，但是当前节点被选中
    if (node.parent && !checkedIdsSet.has(node.parent.id) && checkedIdsSet.has(node.id)) {
      semiCheckedParentIds.push(node.parent)
    }
  })

  // TODO: 需要考虑兄弟节点，一次性过滤：半选，如下操作有大量的重复数据（多个兄弟的组件是共同的）
  const semiCheckedIds = _.uniq(
    semiCheckedParentIds
      .map((s) => getAncestorNodes(s).map((v) => v.id))
      .concat(semiCheckedParentIds.map((v) => v.id))
      .flat()
  )

  return semiCheckedIds
}

// TODO: 用户传进来的数据都需要做一层去重（然后警告⚠️拦截）

// 抽离 groupBy 函数
// const groupByDepth = (flattedData: TreeNodeData[]) => {
//   const depthGroupMap = new Map<number, TreeNodeData[]>()

//   let maxDepth = 0

//   flattedData.forEach((node) => {
//     const depth = node.depth!

//     let depthGroup = depthGroupMap.get(depth)
//     if (!depthGroup) {
//       depthGroup = []
//       depthGroupMap.set(depth!, depthGroup)
//     }

//     depthGroup.push(node)

//     if (depth > maxDepth) {
//       maxDepth = depth
//     }
//   })

//   return [depthGroupMap, maxDepth]
// }
