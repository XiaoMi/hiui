import React from 'react'
import { baseFlattenTree, getTopDownAncestors } from '@hi-ui/tree-utils'
import type { HiBaseFieldNames } from '@hi-ui/core'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'
import {
  CascaderItemRequiredProps,
  CascaderItemEventData,
  CascaderItem,
  FlattedCascaderItem,
} from '../types'

/**
 * 扁平化树数据结构，基于前序遍历
 */
export const flattenTreeData = (treeData: CascaderItem[], fieldNames?: HiBaseFieldNames) => {
  /**
   * 转换对象
   */
  const getKeyFields = (node: any, key: any) => {
    if (fieldNames) {
      return node[(fieldNames as any)[key] || key]
    }
    return node[key]
  }

  return baseFlattenTree<CascaderItem>({
    tree: treeData,
    childrenFieldName: (node) => getKeyFields(node, 'children'),
    transform: (node) => {
      const flattedNode: FlattedCascaderItem = node as FlattedCascaderItem
      const raw = node.raw

      flattedNode.id = getKeyFields(raw, 'id')
      flattedNode.title = getKeyFields(raw, 'title')
      flattedNode.disabled = getKeyFields(raw, 'disabled') ?? false
      flattedNode.isLeaf = getKeyFields(raw, 'isLeaf') ?? false

      return flattedNode
    },
  }) as FlattedCascaderItem[]
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
  const hasChildren = isArrayNonEmpty(node.children)
  return hasChildren || (onLoadChildren && !node.isLeaf && !node.children)
}

export function getItemEventData(
  node: FlattedCascaderItem,
  requiredProps: CascaderItemRequiredProps
): CascaderItemEventData {
  return {
    ...node,
    ...requiredProps,
  }
}
