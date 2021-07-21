import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import _ from 'lodash'
import { TreeNodeData } from '../TreeNode'

export const useCheck = ({
  defaultCheckedIds,
  checkedIds: checkedIdsProp,
  onCheck,
  data,
  flattedData,
}) => {
  const [checkedIds, trySetCheckedIds] = useUncontrolledState(
    defaultCheckedIds,
    checkedIdsProp,
    onCheck
  )

  const checkedIdSet = useMemo(() => new Set(checkedIds), [checkedIds])

  // const onNodeCheck = useCallback(
  //   (checkedNode, checked) => {
  //     let nextCheckedIds: React.ReactText[]
  //     if (checked) {
  //       nextCheckedIds = checkedIds.concat(checkedNode.id)
  //     } else {
  //       nextCheckedIds = checkedIds.filter((id) => id !== checkedNode.id)
  //     }

  //     console.log('onCheckNode--------------', checkedNode, checked)

  //     const semiCheckedIds = getSemiChecked(checkedIds, flattedData, data)

  //     const checkedIdSet = new Set(nextCheckedIds)
  //     const allChildrenNodes = getChildrenIds(checkedNode)
  //     const ancestors = getAncestorIds(checkedNode, data)
  //   },
  //   [checkedIds]
  // )

  const onNodeCheck = useCallback(
    (checkedNode, checked) => {
      let _checkedIds = [...checkedIds, checkedNode.id]

      console.log('onCheckNode--------------', checkedNode, checked)
      const checkedIdSet = new Set(_checkedIds)

      let semiCheckedIds = getSemiChecked(checkedIdSet, flattedData, data)
      console.log('semiCheckedIds', semiCheckedIds)

      const children = getChildrenIds(checkedNode)
      const ancestors = getAncestorIds(checkedNode, data)

      if (checked) {
        // 选中对后代的影响
        children.forEach((child) => {
          if (!_checkedIds.includes(child)) {
            _checkedIds.push(child)
          }

          if (semiCheckedIds.includes(child)) {
            semiCheckedIds = semiCheckedIds.filter((id) => id !== child)
          }
        })

        _checkedIds.push(checkedNode.id)
        semiCheckedIds = semiCheckedIds.filter((id) => id !== checkedNode.id)

        // 选中对所有父辈的影响
        ancestors.forEach((ancestor) => {
          if (
            findNode(ancestor, data)
              .children.map((child) => child.id)
              .every((childId) => _checkedIds.includes(childId))
          ) {
            semiCheckedIds = semiCheckedIds.filter((id) => id !== ancestor)
            _checkedIds.push(ancestor)
          } else {
            semiCheckedIds.push(ancestor)
          }
        })
      } else {
        // 不选中对祖先的影响
        ancestors.forEach((ancestor) => {
          if (_checkedIds.includes(ancestor)) {
            semiCheckedIds.push(ancestor)
          }
          _checkedIds = _checkedIds.filter((id) => id !== ancestor)
          // 还要考虑这个不选中，父辈 semi 也没有了的情况
          let checkChildrenNum = 0
          const ancestorChildren = findNode(ancestor, data).children.map((child) => child.id)
          ancestorChildren.forEach((childId) => {
            if (_checkedIds.includes(childId)) {
              checkChildrenNum = checkChildrenNum + 1
            }
          })
          if (checkChildrenNum === 1) {
            semiCheckedIds = semiCheckedIds.filter((id) => id !== ancestor)
          }
        })
        // 不选中对后代的影响
        children.forEach((child) => {
          if (_checkedIds.includes(child)) {
            _checkedIds = _checkedIds.filter((id) => id !== child)
          }
          if (semiCheckedIds.includes(child)) {
            semiCheckedIds = semiCheckedIds.filter((id) => id !== child)
          }
        })
        _checkedIds = _checkedIds.filter((id) => id !== checkedNode.id)
      }

      // if (!_checkedIds) {
      trySetCheckedIds(_checkedIds)
      // }
      if (onCheck) {
        onCheck(checked, { checkedIds: _checkedIds, semiCheckedIds }, checkedNode)
      }
    },
    [checkedIds, flattedData, data, onCheck]
  )

  return [
    { checkedNodes: checkedIds, semiCheckedIds: getSemiChecked(checkedIdSet, flattedData, data) },
    onNodeCheck,
  ]
}

// 寻找某一节点的所有祖先节点
export const getAncestorIds = (id, data, arr = []) => {
  if (id.parent) {
    arr.push(id.parentId)
    getAncestorIds(id.parent, data, arr)
  }

  return arr
}

// 寻找某一节点的所有子节点
export const getChildrenIds = (node, arr = []) => {
  if (node.children) {
    arr.splice(0, 0, ...node.children.map((i) => i.id))
    node.children.forEach((c) => getChildrenIds(c, arr))
  }

  return arr
}

// 给定一个结合，根据 id 寻找节点
export const findNode = (itemId, data) => {
  let node
  data.forEach((d, index) => {
    if (d.id === itemId) {
      node = d
    } else {
      if (d.children && findNode(itemId, d.children)) {
        node = findNode(itemId, d.children)
      }
    }
  })
  return node
}

const getSemiChecked = (
  checkedIdSet: Set<React.ReactText>,
  flattedData: TreeNodeData[],
  data: TreeNodeData[]
) => {
  const semiCheckedIds = [] as React.ReactText[]

  // 对所有选中节点的祖先节点进行半选（如果其兄弟存在未选中）

  const semiCheckedParentIds = [] as TreeNodeData[]

  flattedData.forEach((node) => {
    // 父节点没选中，但是当前节点被选中
    if (node.parent && !checkedIdSet.has(node.parent.id) && checkedIdSet.has(node.id)) {
      semiCheckedParentIds.push(node.parent)
    }
  })

  // 需要考虑兄弟节点，一次性过滤：半选，如下操作有大量的重复数据（多个兄弟的组件是共同的）
  console.log('getSemiChecked', semiCheckedParentIds)
  // const a = getAncestorIds(6, data)
  // console.log('getAncestorIds', a)

  return _.uniq(
    semiCheckedParentIds
      .map((s) => {
        const a = getAncestorIds(s, data)

        return a
      })
      .concat(semiCheckedParentIds.map((v) => v.id))
      .flat()
  )
}

const getSemiCheckedIds = (checkedIdSet: Set<React.ReactText>, flattedData: TreeNodeData[]) => {
  const semiCheckedIds = []

  const [depthGroupMap, maxDepth] = groupByDepth(flattedData)
}

// TODO: 用户传进来的数据都需要做一层去重（然后警告⚠️拦截）

// 抽离 groupBy 函数
const groupByDepth = (flattedData: TreeNodeData[]) => {
  const depthGroupMap = new Map<number, TreeNodeData[]>()

  let maxDepth = 0

  flattedData.forEach((node) => {
    const depth = node.depth!

    let depthGroup = depthGroupMap.get(depth)
    if (!depthGroup) {
      depthGroup = []
      depthGroupMap.set(depth!, depthGroup)
    }

    depthGroup.push(node)

    if (depth > maxDepth) {
      maxDepth = depth
    }
  })

  return [depthGroupMap, maxDepth]
}
