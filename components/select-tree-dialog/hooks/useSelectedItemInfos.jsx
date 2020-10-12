import { useMemo } from 'react'

/**
 * 获取用于显示的被勾选项信息，数据结构为{id: string,desc: string}[]
 * @param {string[]} checkedIds 子节点被勾选项id数组
 * @param {ITreeNode[]} leafNodeInfos 子节点信息数组
 */
export const useSelectedItemInfos = (checkedIds, leafNodeInfos) => {
  return useMemo(() => {
    return leafNodeInfos
      .filter((item) => checkedIds.includes(item.id))
      .map((item) => ({
        id: item.id,
        desc: item.title
      }))
  }, [checkedIds, leafNodeInfos])
}
