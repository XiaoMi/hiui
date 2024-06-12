import { filterTree, cloneTree, getTreeNodesWithChildren } from '@hi-ui/tree-utils'
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

export const getIdsWithChildren = (treeData: MenuDataItem[]) => {
  return getTreeNodesWithChildren(treeData).map((item) => item.id)
}

export const filterTreeData = (
  treeData: MenuDataItem[],
  searchKey: string,
  activeId: string | number
) => {
  if (searchKey === '') {
    return []
  }

  const clonedData = cloneTree(treeData)
  const activeParents = getAncestorIds(activeId, treeData)
  const sidebarActiveId = activeParents[activeParents.length - 1] ?? activeId

  // 获取当前选中的树节点
  const currentTree = clonedData?.find((d) => d.id === sidebarActiveId)?.children ?? []

  return (
    filterTree(currentTree, (d) => {
      return d.title.includes && d.title.includes(searchKey)
    }) ?? []
  )
}

export const transformTreeData = (
  data: MenuDataItem[],
  fieldNames: Record<string, string> | undefined
) => {
  /**
   * 转换对象
   */
  const getKeyFields = (node: any, key: any) => {
    if (fieldNames) {
      return node[(fieldNames as any)[key] || key]
    }
    return node[key]
  }

  /**
   * 递归处理树形数组
   */
  const traverseNode = (node: MenuDataItem): MenuDataItem => {
    const newNode: MenuDataItem = { ...node }
    newNode.id = getKeyFields(newNode, 'id')
    newNode.title = getKeyFields(newNode, 'title')
    newNode.icon = getKeyFields(newNode, 'icon')
    newNode.disabled = getKeyFields(newNode, 'disabled') ?? false
    newNode.children = getKeyFields(newNode, 'children')
    if (newNode.children) {
      newNode.children = newNode.children.map(traverseNode)
    }
    return newNode
  }

  return data.map(traverseNode)
}
