import { useState, useEffect, useCallback, useMemo } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import _ from 'lodash'

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

  const getSemiChecked = (checkedId, flattedData, data) => {
    const semiCheckedIds = []

    // 对所有选中节点的祖先节点进行半选（如果其兄弟存在未选中）

    flattedData.forEach((node) => {
      if (node.parentId && !checkedIdSet.has(node.parentId) && checkedIdSet.has(node.id)) {
        semiCheckedIds.push(node.parentId)
      }
    })

    // 需要考虑兄弟节点，一次性过滤：半选，如下操作有大量的重复数据（多个兄弟的组件是共同的）

    return _.uniq(
      semiCheckedIds
        .map((s) => getAncestorIds(s, data))
        .concat(semiCheckedIds)
        .flat()
    )
  }

  const onCheckNode = useCallback(
    (checkedNode, checked, _checkedIds) => {
      let semiCheckedIds = getSemiChecked(_checkedIds, flattedData, data)

      let checkedNodes = [..._checkedIds]

      const children = getChildrenIds(checkedNode)
      const ancestors = getAncestorIds(checkedNode.id, data)

      if (checked) {
        // 选中对后代的影响
        children.forEach((child) => {
          if (!checkedNodes.includes(child)) {
            checkedNodes.push(child)
          }
          if (semiCheckedIds.includes(child)) {
            semiCheckedIds = semiCheckedIds.filter((id) => id !== child)
          }
        })

        checkedNodes.push(checkedNode.id)
        semiCheckedIds = semiCheckedIds.filter((id) => id !== checkedNode.id)
        // 选中对所有父辈的影响
        ancestors.forEach((ancestor) => {
          if (
            findNode(ancestor, data)
              .children.map((child) => child.id)
              .every((childId) => checkedNodes.includes(childId))
          ) {
            semiCheckedIds = semiCheckedIds.filter((id) => id !== ancestor)
            checkedNodes.push(ancestor)
          } else {
            semiCheckedIds.push(ancestor)
          }
        })
      } else {
        // 不选中对祖先的影响
        ancestors.forEach((ancestor) => {
          if (checkedNodes.includes(ancestor)) {
            semiCheckedIds.push(ancestor)
          }
          checkedNodes = checkedNodes.filter((id) => id !== ancestor)
          // 还要考虑这个不选中，父辈 semi 也没有了的情况
          let checkChildrenNum = 0
          const ancestorChildren = findNode(ancestor, data).children.map((child) => child.id)
          ancestorChildren.forEach((childId) => {
            if (checkedNodes.includes(childId)) {
              checkChildrenNum = checkChildrenNum + 1
            }
          })
          if (checkChildrenNum === 1) {
            semiCheckedIds = semiCheckedIds.filter((id) => id !== ancestor)
          }
        })
        // 不选中对后代的影响
        children.forEach((child) => {
          if (checkedNodes.includes(child)) {
            checkedNodes = checkedNodes.filter((id) => id !== child)
          }
          if (semiCheckedIds.includes(child)) {
            semiCheckedIds = semiCheckedIds.filter((id) => id !== child)
          }
        })
        checkedNodes = checkedNodes.filter((id) => id !== checkedNode.id)
      }

      if (!checkedIds) {
        setCheckedIds(checkedNodes)
      }
      if (onCheck) {
        onCheck(checked, { checkedIds: checkedNodes, semiCheckedIds }, checkedNode)
      }
    },
    [checkedIds, flattedData, data]
  )

  return [
    { checkedNodes: checkedIds, semiCheckedIds: getSemiChecked(checkedIds, flattedData, data) },
    onCheckNode,
  ]
}

// 寻找某一节点的父节点
export const getParentId = (id, data) => {
  let parentId
  data.forEach((item) => {
    if (item.children) {
      if (item.children.some((item) => item.id === id)) {
        parentId = item.id
      } else if (getParentId(id, item.children)) {
        parentId = getParentId(id, item.children)
      }
    }
  })
  return parentId
}

// 寻找某一节点的所有祖先节点
export const getAncestorIds = (id, data, arr = []) => {
  if (getParentId(id, data)) {
    arr.push(getParentId(id, data))
    getAncestorIds(getParentId(id, data), data, arr)
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

export const getSemiChecked = (checkedIds, data, allData, semiChecked = []) => {
  data.forEach((node) => {
    const ancestorIds = getAncestorIds(node.id, allData)
    if (checkedIds.includes(node.id)) {
      ancestorIds.forEach((ancestorId) => {
        if (!checkedIds.includes(ancestorId) && !semiChecked.includes(ancestorId)) {
          semiChecked.push(ancestorId)
        }
      })
    }
    if (node.children) {
      getSemiChecked(checkedIds, node.children, allData, semiChecked)
    }
  })
  return semiChecked
}
