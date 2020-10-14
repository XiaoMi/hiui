import { useCallback } from 'react'
import { SelectTreeDialogCheckedType } from '..'

export const useRemoveItemCallback = (sourceArray, setSourceArray, usefulNodeInfos, checkedType) =>
  useCallback(
    (id) => {
      const newArray = [...sourceArray]
      // 从 newArray 中删除一个id
      const removeId = (targetId) => {
        const index = newArray.indexOf(targetId)
        if (index > -1) {
          newArray.splice(index, 1)
        }
      }

      // 如果是裁剪类型或者纯子代类型，则无需过多处理，直接删除此Id就好
      // 分析：如果一个节点在裁剪状态下存在于勾选列表中，则代表其子代和父亲不会出现在勾选列表中
      // 分析：纯子代类型没有上下级关系存在于勾选列表中，故而直接删除Id
      if (checkedType !== SelectTreeDialogCheckedType.ALL) {
        removeId(id)
      } else {
        // 当移除的是某一个有子代的节点，则其所有子代都将被移除
        const nodeInfo = usefulNodeInfos.find((item) => item.id === id)
        const needRemoveIds = []

        // 获取所有需要删除的节点id（自身以及子代）
        const getNeedRemoveIds = (rootNode) => {
          if (rootNode.children && rootNode.children.length) {
            rootNode.children.forEach(getNeedRemoveIds)
          }
          needRemoveIds.push(rootNode.id)
        }
        // 移除自身和所有子代id
        getNeedRemoveIds(nodeInfo)
        needRemoveIds.forEach(removeId)

        // 检查存在子代的节点，是否所有子代id都已被勾选
        // 如果不是所有子代都已经被勾选，则代表此节点应该不再被勾选
        const checkNodeIsStillChecked = (targetNode) => {
          if (targetNode.children && targetNode.children.length) {
            const allChildIds = targetNode.children.map((item) => item.id)
            return allChildIds.every((item) => newArray.includes(item))
          }

          return true
        }
        // 缓存，开始轮询，检查所有节点是否存在子代非全选状态
        const cache = [...newArray]
        cache.forEach((checkId) => {
          const checkNodeInfo = usefulNodeInfos.find((item) => item.id === checkId)
          if (!checkNodeIsStillChecked(checkNodeInfo)) {
            removeId(checkId)
          }
        })
      }

      setSourceArray(newArray)
    },
    [sourceArray, setSourceArray]
  )
