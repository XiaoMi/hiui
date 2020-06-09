import { useState, useEffect, useCallback } from 'react'
import { getChildrenIds, getAncestorIds, findNode } from './util'

const useCheckable = ({ defaultCheckedId, checkedId, onCheck, data, flatData }) => {
  const currentCheckedIds = checkedId || defaultCheckedId || []
  const [_checkedId, setCheckedId] = useState(currentCheckedIds)

  useEffect(() => {
    setCheckedId(checkedId)
  }, [checkedId])

  const getSemiChecked = (checkedId, data) => {
    let semiChecked = []
    data.forEach((node) => {
      if (node.parentId && !checkedId.includes(node.parentId) && checkedId.includes(node.id)) {
        semiChecked.push(node.parentId)
      }
    })
    return semiChecked
  }

  const onCheckNode = useCallback(
    (checkedNode, checked) => {
      let semiCheckedIds = getSemiChecked(_checkedId, flatData)
      let checkedIds = [..._checkedId]
      const children = getChildrenIds(checkedNode)
      const ancestors = getAncestorIds(checkedNode.id, data)
      if (checked) {
        // 选中对后代的影响
        children.forEach((child) => {
          if (!checkedIds.includes(child)) {
            checkedIds.push(child)
          }
          if (semiCheckedIds.includes(child)) {
            semiCheckedIds = semiCheckedIds.filter((id) => id !== child)
          }
        })
        checkedIds.push(checkedNode.id)
        semiCheckedIds = semiCheckedIds.filter((id) => id !== checkedNode.id)
        // 选中对所有父辈的影响
        ancestors.forEach((ancestor) => {
          if (
            findNode(ancestor, data)
              .children.map((child) => child.id)
              .every((childId) => checkedIds.includes(childId))
          ) {
            semiCheckedIds = semiCheckedIds.filter((id) => id !== ancestor)
            checkedIds.push(ancestor)
          }
        })
      } else {
        // 不选中对祖先的影响
        ancestors.forEach((ancestor) => {
          if (checkedIds.includes(ancestor)) {
            semiCheckedIds.push(ancestor)
          }
          checkedIds = checkedIds.filter((id) => id !== ancestor)
          // 还要考虑这个不选中，父辈 semi 也没有了的情况
          let checkChildrenNum = 0
          const ancestorChildren = findNode(ancestor, data).children.map((child) => child.id)
          ancestorChildren.forEach((childId) => {
            if (checkedIds.includes(childId)) {
              checkChildrenNum = checkChildrenNum + 1
            }
          })
          if (checkChildrenNum === 1) {
            semiCheckedIds = semiCheckedIds.filter((id) => id !== ancestor)
          }
        })
        // 不选中对后代的影响
        children.forEach((child) => {
          if (checkedIds.includes(child)) {
            checkedIds = checkedIds.filter((id) => id !== child)
          }
          if (semiCheckedIds.includes(child)) {
            semiCheckedIds = semiCheckedIds.filter((id) => id !== child)
          }
        })
        checkedIds = checkedIds.filter((id) => id !== checkedNode.id)
      }

      if (!checkedId) {
        setCheckedId(checkedIds)
      }
      if (onCheck) {
        onCheck({ checkedIds, semiCheckedIds }, { checked, ...checkedNode })
      }
    },
    [checkedId, _checkedId, flatData, data]
  )
  return [_checkedId, onCheckNode]
}

export default useCheckable
