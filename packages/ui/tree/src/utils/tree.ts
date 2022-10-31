import React from 'react'
import { baseFlattenTree } from '@hi-ui/tree-utils'
import { TreeDataItem, FlattedTreeNodeData } from '../types'

const EMPTY_FIELD_NAMES = {} as any
/**
 * 扁平化树数据结构，基于前序遍历
 *
 * @param treeData
 * @returns
 */
export const flattenTreeData = (treeData: TreeDataItem[], fieldNames: any = EMPTY_FIELD_NAMES) => {
  /**
   * 转换对象
   */
  const getKeyFields = (node: any, key: string) => {
    return node[fieldNames[key] || key]
  }

  return baseFlattenTree({
    tree: treeData,
    childrenFieldName: (node) => getKeyFields(node, 'children'),
    transform: (node: any) => {
      const raw = node.raw

      node.id = getKeyFields(raw, 'id')
      node.title = getKeyFields(raw, 'title')
      node.isLeaf = getKeyFields(raw, 'isLeaf') ?? false
      node.disabled = getKeyFields(raw, 'disabled') ?? false

      // 祖先节点顺序由下至上
      return node
    },
  }) as FlattedTreeNodeData[]
}

/**
 * 根据指定 id 的节点查找其所有（包含嵌套）孩子节点的 ids
 *
 * f 开头表示基于扁平 tree 数据，而不是基于原始 tree 数据操作
 *
 * @param flattedTreeData
 * @param targetId
 * @returns
 */
export const fFindNestedChildNodesById = (
  flattedTreeData: FlattedTreeNodeData[],
  targetId: React.ReactText
) => {
  const childrenNodes: FlattedTreeNodeData[] = []

  const { length } = flattedTreeData
  const targetNodeIndex = flattedTreeData.findIndex((node) => node.id === targetId)

  if (targetNodeIndex < 0 || targetNodeIndex === length - 1) {
    return [childrenNodes, targetNodeIndex] as const
  }

  const boundNodeDepth = flattedTreeData[targetNodeIndex].depth

  // 判定子节点：后面连续部分层级大于目标元素的层级
  for (let i = targetNodeIndex + 1; i < length; ++i) {
    const node = flattedTreeData[i]

    if (node.depth > boundNodeDepth) {
      childrenNodes.push(node)
    } else {
      break
    }
  }

  return [childrenNodes, targetNodeIndex] as const
}

/**
 * 根据指定 id 查找对应节点
 *
 * @param flattedTreeData
 * @param targetId
 * @returns 返回第一个被查找到的节点
 */
export const fFindNodeById = (
  flattedTreeData: FlattedTreeNodeData[],
  targetId: React.ReactText
) => {
  return flattedTreeData.find((node) => node.id === targetId)
}

/**
 * 从树中删除指定 id 的第一个被找到的节点
 * 并返回被删除节点
 *
 * @param treeData
 * @param targetId
 * @returns
 */
export const deleteNodeById = (treeData: TreeDataItem[], targetId: React.ReactText) => {
  const { length } = treeData
  for (let i = 0; i < length; ++i) {
    const node = treeData[i]

    if (targetId === node.id) {
      return treeData.splice(i, 1)
    }
    if (node.children) {
      deleteNodeById(node.children, targetId)
    }
  }
}

/**
 * 为指定 id 的第一个被找到的节点添加孩子节点
 *
 * @param treeData
 * @param targetId
 * @param sourceNode
 * @param position 0 表示插入到孩子节点之前，1 表示之后
 * @returns
 */
export const addChildNodeById = (
  treeData: TreeDataItem[],
  targetId: React.ReactText,
  sourceNode: TreeDataItem,
  position: 0 | 1 = 1
) => {
  const { length } = treeData
  for (let i = 0; i < length; ++i) {
    const node = treeData[i]

    if (targetId === node.id) {
      if (!node.children) {
        node.children = []
      }

      if (position === 1) {
        node.children.push(sourceNode)
      } else {
        node.children = [sourceNode].concat(node.children)
      }
      return
    }

    if (node.children) {
      addChildNodeById(node.children, targetId, sourceNode, position)
    }
  }
}

/**
 * 为指定 id 的第一个被找到的节点添加 children 节点
 *
 * @param treeData
 * @param targetId
 * @param children
 */
export const addChildrenById = (
  treeData: TreeDataItem[],
  targetId: React.ReactText,
  children: TreeDataItem[]
) => {
  const { length } = treeData
  for (let i = 0; i < length; ++i) {
    const node = treeData[i]

    if (targetId === node.id) {
      node.children = children
    }

    if (node.children) {
      addChildrenById(node.children, targetId, children)
    }
  }
}

/**
 * 插入节点到指定 id 的节点之前或之后
 *
 * @param treeData
 * @param targetId
 * @param sourceNode
 * @param position 0 表示插入到指定节点之前，1 表示之后
 * @returns
 */
export const insertNodeById = (
  treeData: TreeDataItem[],
  targetId: React.ReactText,
  sourceNode: TreeDataItem,
  position: 0 | 1
) => {
  const { length } = treeData
  for (let i = 0; i < length; ++i) {
    const node = treeData[i]

    if (targetId === node.id) {
      treeData.splice(i + position, 0, sourceNode)
      return
    }

    if (node.children) {
      insertNodeById(node.children, targetId, sourceNode, position)
    }
  }
}
