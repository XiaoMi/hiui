import React from 'react'
import { baseFlattenTree, getTopDownAncestors } from '@hi-ui/tree-utils'
import type { HiBaseFieldNames } from '@hi-ui/core'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'
import {
  CascaderItemRequiredProps,
  CascaderItemEventData,
  CascaderDataItem,
  FlattedCascaderDataItem,
} from '../types'

/**
 * 扁平化树数据结构，基于前序遍历
 */
export const flattenTreeData = (treeData: CascaderDataItem[], fieldNames?: HiBaseFieldNames) => {
  /**
   * 转换对象
   */
  const getKeyFields = (node: any, key: any) => {
    if (fieldNames) {
      return node[(fieldNames as any)[key] || key] ?? node[key]
    }
    return node[key]
  }

  return baseFlattenTree<CascaderDataItem>({
    tree: treeData,
    childrenFieldName: (node) => getKeyFields(node, 'children'),
    transform: (node) => {
      const flattedNode: FlattedCascaderDataItem = node as FlattedCascaderDataItem
      const raw = node.raw

      flattedNode.id = getKeyFields(raw, 'id')
      flattedNode.title = getKeyFields(raw, 'title')
      flattedNode.disabled = getKeyFields(raw, 'disabled') ?? false
      flattedNode.isLeaf = getKeyFields(raw, 'isLeaf') ?? false

      return flattedNode
    },
  }) as FlattedCascaderDataItem[]
}

/**
 * 获取选中节点的节点路径，包含选中节点
 */
export const getActiveNodePaths = (
  flattedData: FlattedCascaderDataItem[],
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
  flattedData: FlattedCascaderDataItem[],
  selectedId?: React.ReactText
) => {
  if (flattedData.length === 0) return []

  const root = flattedData[0].parent
  let menu: FlattedCascaderDataItem[][] = [root!.children]

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
  data: FlattedCascaderDataItem[],
  filter: (option: FlattedCascaderDataItem) => boolean
) => {
  return [data.filter((item) => !filter(item))]
}

export const checkCanLoadChildren = (node: FlattedCascaderDataItem, onLoadChildren?: any) => {
  const hasChildren = isArrayNonEmpty(node.children)
  return hasChildren || (onLoadChildren && !node.isLeaf && !node.children)
}

export function getItemEventData(
  node: FlattedCascaderDataItem,
  requiredProps: CascaderItemRequiredProps
): CascaderItemEventData {
  return {
    ...node,
    ...requiredProps,
  }
}

export const getFilteredMenuList = (menuList: FlattedCascaderDataItem[][], searchedData: any[]) => {
  const result = [] as any[]

  searchedData.forEach((item) => {
    while (item && item.depth >= 0) {
      const depth = item.depth
      let depthResult = result[depth] as Map<React.ReactText, any>

      if (!depthResult) {
        depthResult = new Map()
        result[depth] = depthResult
      }

      depthResult.set(item.id, item)
      item = item.parent
    }
  })

  return menuList.map((depthItems, depth) => {
    const depthSavedMp = result[depth]
    if (!depthSavedMp) return depthItems

    return depthItems.filter((item: any) => {
      const depthSavedMp = result[item.depth]

      if (!depthSavedMp) return true
      if (depthSavedMp.has(item.id)) return true
      return false
    })
  })
}
