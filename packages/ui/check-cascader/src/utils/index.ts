import React from 'react'
import {
  CheckCascaderItemRequiredProps,
  CheckCascaderItemEventData,
  CheckCascaderItem,
  FlattedCheckCascaderItem,
  FlattedCheckCascaderItemWithChildren,
  NodeRoot,
} from '../types'

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

/**
 * 获取祖先节点，包括自己
 * @param node
 * @returns
 */
export const getNodeAncestors = (node: FlattedCheckCascaderItem) => {
  const ancestors: FlattedCheckCascaderItem[] = []

  while (node.parent) {
    ancestors.push(node)
    node = node.parent
  }
  return ancestors
}

export const getActiveMenus = (data: FlattedCheckCascaderItem[], selectedIds?: React.ReactText) => {
  if (data.length === 0) return []

  const root = data[0].parent
  let menu: FlattedCheckCascaderItem[][] = [root!.children]

  if (typeof selectedIds === 'undefined') return menu

  let selectedOption = data.find(({ id }) => selectedIds === id)
  if (!selectedOption) return menu

  if (selectedOption.children) {
    menu = [selectedOption.children]
  } else {
    menu = []
  }

  while (selectedOption.parent) {
    menu.push(selectedOption.parent.children)
    selectedOption = selectedOption?.parent
  }

  return menu.reverse()
}

export const getFlattedMenus = (data: FlattedCheckCascaderItem[]) => {
  return [data.filter(({ checkable }) => checkable)]
}

export const getActiveMenuIds = (
  data: FlattedCheckCascaderItem[],
  selectedIds?: React.ReactText
) => {
  if (data.length === 0) return []

  const selectedOption = data.find(({ id }) => selectedIds === id)
  if (!selectedOption) return []

  return getNodeAncestors(selectedOption)
    .map(({ id }) => id)
    .reverse()
}

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

export function getCascaderItemEventData(
  node: FlattedCheckCascaderItem,
  requiredProps: CheckCascaderItemRequiredProps
): CheckCascaderItemEventData {
  return {
    ...node,
    ...requiredProps,
  }
}
