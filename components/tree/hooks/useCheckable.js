import { useState, useEffect, useCallback } from 'react'
import { getChildrenIds, getAncestorIds, findNode } from '../util'
import _ from 'lodash'

const useCheckable = ({ defaultCheckedIds, checkedIds, onCheck, data, flatData }) => {
  const currentCheckedIds = checkedIds || defaultCheckedIds || []
  const [_checkedIds, setCheckedIds] = useState(currentCheckedIds)

  useEffect(() => {
    if (checkedIds) {
      setCheckedIds(checkedIds)
    }
  }, [checkedIds])

  const getSemiChecked = (checkedId, flatData, data) => {
    let semiChecked = []
    flatData.forEach((node) => {
      if (node.parentId && !checkedId.includes(node.parentId) && checkedId.includes(node.id)) {
        semiChecked.push(node.parentId)
      }
    })
    return _.uniq(
      semiChecked
        .map((s) => getAncestorIds(s, data))
        .concat(semiChecked)
        .flat()
    )
  }

  const onCheckNode = useCallback(
    (checkedNode, checked, _checkedIds) => {
      let semiCheckedIds = getSemiChecked(_checkedIds, flatData, data)
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
        onCheck({ checkedIds: checkedNodes, semiCheckedIds }, { checked, ...checkedNode })
      }
    },
    [checkedIds, flatData, data]
  )
  return [
    { checkedNodes: _checkedIds, semiCheckedIds: getSemiChecked(_checkedIds, flatData, data) },
    onCheckNode
  ]
}

export default useCheckable
