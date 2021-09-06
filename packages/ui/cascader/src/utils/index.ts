import { flattenTree, getNodeAncestorsWithMe } from '@hi-ui/tree-utils'
import React from 'react'
import {
  CascaderItemRequiredProps,
  CascaderItemEventData,
  CascaderItem,
  FlattedCascaderItem,
} from '../types'

/**
 * 扁平化树数据结构，基于前序遍历
 */
export const flattenTreeData = (treeData: CascaderItem[]) => {
  return flattenTree<CascaderItem>(treeData, (node) => {
    const flattedNode: FlattedCascaderItem = node as FlattedCascaderItem
    const { title, isLeaf = false, disabled = false } = node.raw
    flattedNode.title = title
    flattedNode.isLeaf = isLeaf
    flattedNode.disabled = disabled
    return flattedNode
  }) as FlattedCascaderItem[]
}

/**
 * 获取自顶向下的祖先节点，包括自己
 */
export const getTopDownAncestors = (node: FlattedCascaderItem) => {
  console.log(getNodeAncestorsWithMe(node).reverse())

  return getNodeAncestorsWithMe(node).reverse()
}

/**
 * 获取选中节点的节点路径，包含选中节点
 */
export const getActiveNodePaths = (
  flattedData: FlattedCascaderItem[],
  selectedId?: React.ReactText
) => {
  if (flattedData.length === 0) return []

  const selectedOption = flattedData.find(({ id }) => selectedId === id)
  if (!selectedOption) return []

  return getTopDownAncestors(selectedOption)
}

/**
 * 获取自顶向下的兄弟节点列表菜单
 */
export const getActiveMenus = (
  flattedData: FlattedCascaderItem[],
  selectedId?: React.ReactText
) => {
  if (flattedData.length === 0) return []

  const root = flattedData[0].parent
  let menu: FlattedCascaderItem[][] = [root!.children]

  if (typeof selectedId === 'undefined') return menu

  let selectedOption = flattedData.find(({ id }) => selectedId === id)
  if (!selectedOption) return menu

  if (selectedOption.children) {
    menu = [selectedOption.children]
  } else {
    menu = []
  }

  while (selectedOption.parent) {
    menu.push(selectedOption.parent.children)
    selectedOption = selectedOption.parent
  }

  return menu.reverse()
}

export const getFlattedMenus = (
  data: FlattedCascaderItem[],
  filter: (option: FlattedCascaderItem) => boolean
) => {
  return [data.filter((item) => !filter(item))]
}

export const checkCanLoadChildren = (node: FlattedCascaderItem, onLoadChildren?: any) => {
  const hasChildren = node.children && node.children.length > 0
  return hasChildren || (onLoadChildren && !node.children && !node.isLeaf)
}

export function getCascaderItemEventData(
  node: FlattedCascaderItem,
  requiredProps: CascaderItemRequiredProps
): CascaderItemEventData {
  return {
    ...node,
    ...requiredProps,
  }
}
