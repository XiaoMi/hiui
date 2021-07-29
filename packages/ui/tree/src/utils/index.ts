import React from 'react'
import { TreeNodeData } from '../TreeNode'

/**
 * 扁平化树数据结构，基于前序遍历
 *
 * @param data
 * @returns
 */
export const flattenTreeData = (data: TreeNodeData[]) => {
  const flattedTreeData: TreeNodeData[] = []

  const dig = (
    node: TreeNodeData,
    depth = 0,
    parent?: TreeNodeData,
    ancestors?: TreeNodeData[],
    siblings?: TreeNodeData[]
  ) => {
    const flattedNode = { ...node }
    flattedTreeData.push(flattedNode)

    // 关联用户传入的原始节点
    flattedNode.raw = node
    flattedNode.depth = depth
    flattedNode.parent = parent
    flattedNode.ancestors = ancestors
    // 兄弟节点，注意其中会包含本身节点
    flattedNode.siblings = siblings

    if (flattedNode.children) {
      const { children } = flattedNode
      const childDepth = depth + 1
      // 祖先节点顺序由下至上
      const childAncestors = [flattedNode].concat(ancestors || [])

      children.forEach((child) => dig(child, childDepth, flattedNode, childAncestors, children))
    }
  }

  data.forEach((node) => dig(node))

  return flattedTreeData
}

/**
 * 根据指定 id 的节点查找其所有（包含嵌套）孩子节点的 ids
 *
 * @param flattedTreeData
 * @param targetId
 * @returns
 */
export const fFindNestedChildNodesById = (
  flattedTreeData: TreeNodeData[],
  targetId: React.ReactText
): TreeNodeData[] => {
  const childrenNodes: TreeNodeData[] = []

  const { length } = flattedTreeData
  const targetNodeIndex = flattedTreeData.findIndex((node) => node.id === targetId)

  if (targetNodeIndex < 0 || targetNodeIndex === length - 1) return childrenNodes

  const boundNodeDepth = flattedTreeData[targetNodeIndex].depth!

  // 判定子节点：后面连续部分层级大于目标元素的层级
  for (let i = targetNodeIndex + 1; i < length; ++i) {
    const node = flattedTreeData[i]

    if (node.depth! > boundNodeDepth) {
      childrenNodes.push(node)
    } else {
      break
    }
  }

  return childrenNodes
}

/**
 * 根据指定 id 查找对应节点
 *
 * @param flattedTreeData
 * @param targetId
 * @returns 返回第一个被查找到的节点
 */
export const fFindNodeById = (flattedTreeData: TreeNodeData[], targetId: React.ReactText) => {
  return flattedTreeData.find((node) => node.id === targetId)?.raw
}

/**
 * 从树中删除指定 id 的第一个被找到的节点
 *
 * @param treeData
 * @param targetId
 * @returns
 */
export const deleteNodeById = (treeData: TreeNodeData[], targetId: React.ReactText) => {
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
 * @returns
 */
export const addChildNodeById = (
  treeData: TreeNodeData[],
  targetId: React.ReactText,
  sourceNode: TreeNodeData
) => {
  const { length } = treeData
  for (let i = 0; i < length; ++i) {
    const node = treeData[i]

    if (targetId === node.id) {
      if (!node.children) {
        node.children = []
      }

      node.children.push(sourceNode)
      return
    }

    if (node.children) {
      addChildNodeById(node.children, targetId, sourceNode)
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
  treeData: TreeNodeData[],
  targetId: React.ReactText,
  sourceNode: TreeNodeData,
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

/**
 * 生成 uuid
 *
 * @returns uuid
 */
export const uuid = () => Math.random().toString(36).substring(5).split('').join('.')
