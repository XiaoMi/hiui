import {
  CheckCascaderItem,
  FlattedCheckCascaderItem,
  FlattedCheckCascaderItemWithChildren,
  NodeRoot,
} from '../types'
import React from 'react'

export const debounce = <T extends (...args: any[]) => void>(func?: T, delay = 150) => {
  let timer = 0

  const cancel = () => {
    if (timer) {
      window.clearTimeout(timer)
      timer = 0
    }
  }

  const debounceFn = (...args: any[]) => {
    if (timer) {
      cancel()
    }

    if (func) {
      timer = window.setTimeout(() => {
        func.apply(null, args)
        timer = 0
      }, delay)
    }
  }

  debounceFn.cancel = cancel

  return debounceFn as T & { cancel: () => void }
}

/**
 * 扁平化树数据结构，基于前序遍历
 *
 * @param treeData
 * @returns
 */
export const flattenTreeData = (treeData: CheckCascaderItem[]) => {
  const flattedTreeData: FlattedCheckCascaderItem[] = []

  const dig = (
    node: CheckCascaderItem,
    depth: number,
    parent: FlattedCheckCascaderItemWithChildren
  ) => {
    const {
      id,
      title,
      children,
      checkable = true,
      isLeaf = false,
      disabled = false,
      disabledCheckbox = false,
    } = node

    const flattedNode: FlattedCheckCascaderItem = {
      id,
      title,
      depth,
      parent,
      raw: node,
      isLeaf,
      disabled,
      disabledCheckbox,
      checkable,
      // pos: flattedTreeData.length,
    }

    flattedTreeData.push(flattedNode)

    if (children) {
      const childDepth = depth + 1

      flattedNode.children = children.map((child) => {
        return dig(child, childDepth, flattedNode as FlattedCheckCascaderItemWithChildren)
      })
    }

    return flattedNode
  }

  // @ts-ignore
  const treeRoot: NodeRoot<FlattedCheckCascaderItem> = getTreeRoot()
  // @ts-ignore
  treeRoot.children = treeData.map((node) => dig(node, 0, treeRoot))

  return flattedTreeData
}

const getTreeRoot = () => {
  return {
    depth: -1,
  }
}

export const getNodeAncestors = (node: FlattedCheckCascaderItem) => {
  const ancestors: FlattedCheckCascaderItem[] = []

  while (node.parent) {
    ancestors.push(node)
    node = node.parent
  }
  return ancestors
}

export const getActiveMenus = (
  data: FlattedCheckCascaderItem[],
  selectedIds: React.ReactText[]
) => {
  const menu: FlattedCheckCascaderItem[][] = []

  if (data.length === 0) return []

  // 从 value 中 找到指定的 options（逐层查找）
  const dig = (data: FlattedCheckCascaderItem[], depth: number) => {
    menu.push(data)

    for (let i = 0; i < data.length; i++) {
      const node = data[i]
      // 找到下一级
      if (selectedIds[depth] === node.id) {
        if (node.children) {
          dig(node.children, depth + 1)
        }
        break
      }
    }
  }

  const root = data[0].parent
  dig(root!.children, 0)

  return menu
}
