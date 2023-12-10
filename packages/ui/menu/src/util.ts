import { filterTree, cloneTree } from '@hi-ui/tree-utils'
import { MenuDataItem } from './types'

// 寻找某一节点的父节点
export const getParentId = (id: string | number, data: Record<string, any>[]): string | number => {
  let parentId = '' as string | number
  data.forEach((item) => {
    if (item.children) {
      if (item.children.some((item: Record<string, any>) => item.id === id)) {
        parentId = item.id
      } else if (getParentId(id, item.children)) {
        parentId = getParentId(id, item.children)
      }
    }
  })
  return parentId
}

// 寻找某一节点的所有祖先节点
export const getAncestorIds = (
  id: string | number,
  data: Record<string, any>[],
  arr: (string | number)[] = []
) => {
  if (getParentId(id, data)) {
    arr.push(getParentId(id, data))
    getAncestorIds(getParentId(id, data), data, arr)
  }
  return arr
}

export const filterTreeData = (
  treeData: MenuDataItem[],
  searchKey: string,
  activeId: string | number,
  level: number = 1
) => {
  if (searchKey === '') {
    return []
  }

  const activeParents = getAncestorIds(activeId, treeData)
  const clonedData = cloneTree(treeData)
  const sidebarActiveId = activeParents[activeParents.length - 1] ?? activeId

  // 获取当前选中的树节点
  const currentTree = clonedData.find((d) => d.id === sidebarActiveId)

  if (!currentTree) {
    return []
  }

  const result = filterTree(currentTree?.children ?? [], (d) => {
    return d.title.includes(searchKey)
  })

  if (level === 1) {
    currentTree.children = result
    return clonedData
  } else {
    return result
  }
}
