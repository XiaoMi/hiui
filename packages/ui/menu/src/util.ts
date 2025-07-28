import { filterTree, cloneTree, getTreeNodesWithChildren } from '@hi-ui/tree-utils'
import { MenuDataItem } from './types'
import { HiBaseFieldNameKeys, HiBaseFieldNames } from '@hi-ui/core'
import React from 'react'

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

export const transformTreeData = (data: MenuDataItem[], fieldNames?: HiBaseFieldNames) => {
  /**
   * 转换对象
   */
  const getKeyFields = (node: MenuDataItem, key: HiBaseFieldNameKeys) => {
    if (fieldNames) {
      return node[(fieldNames[key] || key) as keyof MenuDataItem]
    }
    return node[key]
  }

  /**
   * 递归处理树形数组
   */
  const traverseTreeNode = (node: MenuDataItem): MenuDataItem => {
    const newNode: MenuDataItem = { ...node }
    newNode.id = getKeyFields(newNode, 'id') as React.ReactText
    newNode.title = getKeyFields(newNode, 'title')
    newNode.icon = getKeyFields(newNode, 'icon' as HiBaseFieldNameKeys)
    newNode.disabled = (getKeyFields(newNode, 'disabled') ?? false) as boolean
    newNode.children = getKeyFields(newNode, 'children') as MenuDataItem[]
    if (newNode.children) {
      newNode.children = newNode.children.map(traverseTreeNode)
    }
    return newNode
  }

  return data.map(traverseTreeNode)
}

/**
 * 根据关键字匹配菜单数据的算法
 * @param data 菜单数据数组
 * @param keyword 搜索关键字
 * @returns 匹配结果数组
 */
export function searchMenuByKeyword(data: MenuDataItem[], keyword: string): MenuDataItem[] {
  if (!keyword || !data || data.length === 0) {
    return []
  }

  const results: MenuDataItem[] = []
  const processedIds = new Set<React.ReactText>() // 避免重复添加

  // 递归搜索函数
  function searchInTree(nodes: MenuDataItem[]): void {
    for (const node of nodes) {
      const isMatched = node.title?.toString().toLowerCase().includes(keyword.toLowerCase())

      if (isMatched) {
        // 如果匹配到当前节点
        if (!node.children || node.children.length === 0) {
          // 规则1: 如果是叶子节点，直接返回该节点
          if (!processedIds.has(node.id)) {
            results.push(node)
            processedIds.add(node.id)
          }
        } else {
          // 规则2: 如果是父节点，返回所有嵌套的子节点
          addAllDescendants(node.children)
        }
      } else {
        // 如果当前节点不匹配，继续搜索子节点
        if (node.children && node.children.length > 0) {
          searchInTree(node.children)
        }
      }
    }
  }

  // 递归添加所有后代节点
  function addAllDescendants(children: MenuDataItem[]): void {
    for (const child of children) {
      if (!processedIds.has(child.id)) {
        results.push(child)
        processedIds.add(child.id)
      }

      // 递归添加子节点的子节点
      if (child.children && child.children.length > 0) {
        addAllDescendants(child.children)
      }
    }
  }

  searchInTree(data)
  return results
}

// 扩展版本：包含路径信息的搜索结果
export interface MenuSearchResult {
  node: MenuDataItem
  path: MenuDataItem[] // 从根节点到当前节点的路径
  level: number // 节点层级
}

/**
 * 增强版搜索函数，返回包含路径信息的结果
 */
export function searchMenuWithPath(data: MenuDataItem[], keyword: string): MenuSearchResult[] {
  if (!keyword || !data || data.length === 0) {
    return []
  }

  const results: MenuSearchResult[] = []
  const processedIds = new Set<React.ReactText>()

  function searchInTree(nodes: MenuDataItem[], currentPath: MenuDataItem[] = []): void {
    for (const node of nodes) {
      const nodePath = [...currentPath, node]
      const isMatched = node.title?.toString().toLowerCase().includes(keyword.toLowerCase())

      if (isMatched) {
        if (!node.children || node.children.length === 0) {
          // 叶子节点
          if (!processedIds.has(node.id)) {
            results.push({
              node,
              path: nodePath,
              level: nodePath.length - 1,
            })
            processedIds.add(node.id)
          }
        } else {
          // 父节点，添加所有子节点
          addAllDescendantsWithPath(node.children, nodePath)
        }
      } else {
        // 继续搜索子节点
        if (node.children && node.children.length > 0) {
          searchInTree(node.children, nodePath)
        }
      }
    }
  }

  function addAllDescendantsWithPath(children: MenuDataItem[], parentPath: MenuDataItem[]): void {
    for (const child of children) {
      const childPath = [...parentPath, child]

      if (!processedIds.has(child.id)) {
        results.push({
          node: child,
          path: childPath,
          level: childPath.length - 1,
        })
        processedIds.add(child.id)
      }

      if (child.children && child.children.length > 0) {
        addAllDescendantsWithPath(child.children, childPath)
      }
    }
  }

  searchInTree(data)
  return results
}
