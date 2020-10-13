import { useCallback } from 'react'

export const useRemoveItemCallback = (sourceArray, setSourceArray, usefulNodeInfos) =>
  useCallback(
    (id) => {
      // 当移除的是某一个有子代的节点，则其所有子代都将被移除
      const nodeInfo = usefulNodeInfos.find((item) => item.id === id)
      const needRemoveIds = []
      const newArray = [...sourceArray]
      const removeId = (targetId) => {
        const index = newArray.indexOf(targetId)
        if (index > -1) {
          newArray.splice(index, 1)
        }
      }
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
      // 缓存，开始轮询
      const cache = [...newArray]
      cache.forEach((checkId) => {
        const checkNodeInfo = usefulNodeInfos.find((item) => item.id === checkId)
        if (!checkNodeIsStillChecked(checkNodeInfo)) {
          removeId(checkId)
        }
      })

      setSourceArray(newArray)
    },
    [sourceArray, setSourceArray]
  )
