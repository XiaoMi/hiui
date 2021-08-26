import React from 'react'

/**
 * 扁平化树数据结构，基于前序遍历
 *
 * @param treeData
 * @returns
 */
export const flattenTree = <T extends BaseTreeNodeData>(
  tree: T[],
  transform?: (node: BaseFlattedTreeNodeData<any, T>) => any
) => {
  const flattedTree: BaseFlattedTreeNodeData<any>[] = []

  const dig = (
    depth: number,
    node: BaseTreeNodeData,
    parent: BaseFlattedTreeNodeDataWithChildren<any>
  ) => {
    const { id, children } = node

    const flattedNode: BaseFlattedTreeNodeData<any> = {
      id,
      depth,
      parent,
      raw: node,
    }

    flattedTree.push(transform ? transform(flattedNode) : flattedNode)

    if (children) {
      const childDepth = depth + 1

      flattedNode.children = children.map((child) => {
        return dig(childDepth, child, flattedNode as BaseFlattedTreeNodeDataWithChildren<any>)
      })
    }

    return flattedNode
  }

  // @ts-ignore
  const treeRoot: NodeRoot<BaseFlattedTreeNodeData<any>> = getTreeRoot()
  // @ts-ignore
  treeRoot.children = tree.map((node) => dig(0, node, treeRoot))

  return flattedTree
}

/**
 * 作为树的 ROOT_HOST，用于快速获取兄弟节点
 */
const getTreeRoot = () => {
  return {
    depth: -1,
  }
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
export const fFindNestedChildNodesById = <T extends BaseFlattedTreeNodeData<T>>(
  flattedTreeData: T[],
  targetId: React.ReactText
) => {
  const childrenNodes = [] as T[]

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
export const fFindNodeById = <T extends BaseTreeNodeData>(
  flattedTreeData: T[],
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
export const deleteNodeById = <T extends BaseTreeNodeData>(
  treeData: T[],
  targetId: React.ReactText
) => {
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
export const addChildNodeById = <T extends BaseTreeNodeData>(
  treeData: T[],
  targetId: React.ReactText,
  sourceNode: T,
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
        node.children = [sourceNode].concat(node.children as T[])
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
export const addChildrenById = <T extends BaseTreeNodeData>(
  treeData: T[],
  targetId: React.ReactText,
  children: T[]
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
export const insertNodeById = <T extends BaseTreeNodeData>(
  treeData: T[],
  targetId: React.ReactText,
  sourceNode: T,
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
 * 寻找某一节点的所有子节点
 *
 * @param node
 * @returns
 */
export const findNestedChildren = <T extends BaseTreeNodeData>(
  node: T,
  filter?: (item: any) => boolean | void
) => {
  const allChildren: T[] = []

  const dig = (node: BaseTreeNodeData) => {
    if (node.children) {
      node.children.forEach((child: BaseTreeNodeData) => {
        // 过滤节点及其子树
        if (filter && filter(child) === false) return

        allChildren.push(child as T)
        dig(child)
      })
    }
  }

  dig(node)
  return allChildren
}

/**
 * 获取祖先节点
 * @param node
 * @returns
 */
export const getNodeAncestors = <T extends BaseFlattedTreeNodeDataWithParent>(
  node: T,
  filter?: (item: any) => boolean | void
) => {
  const ancestors = [] as T[]

  let tNode = node.parent

  while (tNode && tNode.parent) {
    // 过滤节点及其子树
    if (filter && filter(tNode) === false) break

    ancestors.push(tNode)
    tNode = tNode.parent
  }

  return ancestors
}

export interface BaseTreeNodeData {
  id: React.ReactText
  children?: BaseTreeNodeData[]
}

export interface BaseFlattedTreeNodeDataWithParent<T = any> {
  parent?: T
}

// TODO: ts 类型工具函数 将指定属性转为非可选属性
export interface BaseFlattedTreeNodeDataWithChildren<T extends BaseFlattedTreeNodeData<any>>
  extends BaseFlattedTreeNodeData<any> {
  children: T[]
}

export interface BaseFlattedTreeNodeData<T extends BaseFlattedTreeNodeData<T, any>, R = any> {
  id: React.ReactText
  parent?: BaseFlattedTreeNodeDataWithChildren<T>
  children?: T[]
  depth: number
  raw: R
}

export interface NodeRoot<T> {
  depth: -1
  children: T[]
}
