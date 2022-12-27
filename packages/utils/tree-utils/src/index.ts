import React from 'react'
import {
  NodeRoot,
  BaseTreeNodeData,
  BaseFlattedTreeNodeData,
  BaseFlattedTreeNodeDataWithParent,
  BaseFlattedTreeNodeDataWithChildren,
  BaseTreeNode,
} from './types'

/**
 * 递归遍历 tree 型结构数据，以 `children` 作为节点孩子
 *
 * 对于 visit 函数：
 *  depth 以 0 打头表示最外层，可以结合数组下标 0 开头方便记忆
 *  parent 将为 null ，如果当前 node 是最外层节点
 */
export const visitTree = <T extends BaseTreeNode>(
  tree: T[],
  visit?: (node: T, depth: number, parent: T | null) => void
) => {
  if (!visit) return

  const dig = (depth: number, node: T, parent: T | null) => {
    visit(node, depth, parent)

    if (node.children) {
      const childDepth = depth + 1

      node.children.forEach((child: any) => {
        dig(childDepth, child, node)
      })
    }
  }

  tree.forEach((node) => {
    dig(0, node, null)
  })
}

/**
 * 扁平化树数据结构，基于前序遍历
 *
 * @param treeData
 * @returns
 */
export const flattenTree = <T extends BaseTreeNodeData>(
  tree: T[],
  transform?: (node: BaseFlattedTreeNodeData<any, T>, rootIndex: number) => any
) => {
  const flattedTree: BaseFlattedTreeNodeData<any>[] = []

  const dig = (
    depth: number,
    node: BaseTreeNodeData,
    parent: BaseFlattedTreeNodeDataWithChildren<any>,
    rootIndex: number
  ) => {
    const { id, children } = node

    let flattedNode: BaseFlattedTreeNodeData<any> = {
      id,
      depth,
      parent,
      raw: node,
    }

    flattedNode = transform ? transform(flattedNode, rootIndex) : flattedNode

    flattedTree.push(flattedNode)

    if (children) {
      const childDepth = depth + 1

      flattedNode.children = children.map((child) => {
        return dig(
          childDepth,
          child,
          flattedNode as BaseFlattedTreeNodeDataWithChildren<any>,
          // 存储自身所在树的 root 节点索引
          rootIndex
        )
      })
    }

    return flattedNode
  }

  // @ts-ignore
  const treeRoot: NodeRoot<BaseFlattedTreeNodeData<any>> = getTreeRoot()
  // @ts-ignore
  treeRoot.children = tree.map((node, index) => dig(0, node, treeRoot, index))

  return flattedTree
}

/**
 * 转换对象
 */
const getChildrenField = (node: any) => {
  return node.children
}

export const baseFlattenTree = <T extends Record<string, any>>({
  tree,
  transform,
  childrenFieldName = getChildrenField,
}: {
  tree: T[]
  transform?: (node: BaseFlattedTreeNodeData<any, T>, rootIndex: number) => any
  childrenFieldName?: (node: BaseTreeNodeData) => BaseTreeNodeData[]
}) => {
  const flattedTree: BaseFlattedTreeNodeData<any>[] = []

  const dig = (
    depth: number,
    node: BaseTreeNodeData,
    parent: BaseFlattedTreeNodeDataWithChildren<any>,
    rootIndex: number
  ) => {
    const children = childrenFieldName(node)

    // @ts-ignore
    let flattedNode: BaseFlattedTreeNodeData<any> = {
      raw: node,
      depth,
      parent,
    }

    flattedNode = transform ? transform(flattedNode, rootIndex) : flattedNode

    flattedTree.push(flattedNode)

    if (children) {
      const childDepth = depth + 1

      flattedNode.children = children.map((child) => {
        return dig(
          childDepth,
          child,
          flattedNode as BaseFlattedTreeNodeDataWithChildren<any>,
          // 存储自身所在树的 root 节点索引
          rootIndex
        )
      })
    }

    return flattedNode
  }

  // @ts-ignore
  const treeRoot: NodeRoot<BaseFlattedTreeNodeData<any>> = getTreeRoot()
  // @ts-ignore
  treeRoot.children = tree.map((node, index) => dig(0, node, treeRoot, index))

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
 * 判断是否到顶
 */
export const isTreeRoot = <T extends { depth: number }>(
  parent: T | null | undefined
): parent is null | undefined => {
  // parent && parent.depth >= 0
  return !parent || parent.depth === -1
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
  const targetNodeIndex = flattedTreeData.findIndex((node) => node.id === targetId)
  const nestedChildren = fFindNestedChildNodesByIndex(flattedTreeData, targetNodeIndex)
  return [nestedChildren, targetNodeIndex] as const
}

/**
 * 根据指定节点索引查找其所有（包含嵌套）孩子节点的 ids
 *
 * f 开头表示基于扁平 tree 数据，而不是基于原始 tree 数据操作
 *
 */
export const fFindNestedChildNodesByIndex = <T extends BaseFlattedTreeNodeData<T>>(
  flattedTreeData: T[],
  targetIndex: number
) => {
  const childrenNodes = [] as T[]
  const { length } = flattedTreeData

  if (targetIndex < 0 || targetIndex === length - 1) {
    return childrenNodes
  }

  const boundNodeDepth = flattedTreeData[targetIndex].depth

  // 判定子节点：后面连续部分层级大于目标元素的层级
  for (let i = targetIndex + 1; i < length; ++i) {
    const node = flattedTreeData[i]

    if (node.depth > boundNodeDepth) {
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
export const fFindNodeById = <T extends BaseTreeNodeData>(
  flattedTreeData: T[],
  targetId: React.ReactText
) => {
  return flattedTreeData.find((node) => node.id === targetId)
}

/**
 * 根据指定 ids 列表在树形数据中查找节点，并返回查找到节点列表
 *
 *  f 开头表示基于扁平 tree 数据，而不是基于原始 tree 数据操作
 *
 * @param TreeData
 * @param targetId
 * @returns 返回所有存在且被查找到的节点列表
 */
export const fFindNodesByIds = <T extends BaseTreeNodeData>(
  treeData: T[],
  targetIds: React.ReactText[]
) => {
  if (targetIds.length === 0) return []

  const foundResult = [] as T[]
  const targetIdsSet = new Set(targetIds)

  const { length } = treeData

  for (let i = 0; i < length; ++i) {
    const node = treeData[i]

    if (targetIdsSet.has(node.id)) {
      foundResult.push(node)
      targetIdsSet.delete(node.id)

      if (targetIdsSet.size === 0) return
    }
  }
  // 怎么处理 notfoundIds，给用户自己处理
  // targetIds.filter((id) => foundResult.find((item) => item.id !== id))

  return foundResult
}

/**
 * 根据指定 id 在树形数据中查找对应节点
 *
 * @param TreeData
 * @param targetId
 * @returns 返回第一个被查找到的节点
 */
export const findNodeById = <T extends BaseTreeNode>(
  treeData: T[],
  targetId: React.ReactText,
  options?: { idFieldName?: string; childrenFieldName?: string }
): null | T => {
  const { idFieldName = 'id', childrenFieldName = 'children' } = options || {}

  const { length } = treeData
  for (let i = 0; i < length; ++i) {
    const node = treeData[i]

    if (targetId === node[idFieldName]) {
      return node
    }

    if (node[childrenFieldName]) {
      const foundNode = findNodeById(node[childrenFieldName], targetId)

      if (foundNode) {
        return foundNode as T
      }
    }
  }
  return null
}

/**
 * 根据指定 ids 列表在树形数据中查找节点，并返回查找到节点列表
 *
 * @param TreeData
 * @param targetId
 * @returns 返回所有存在且被查找到的节点列表
 */
export const findNodesByIds = <T extends BaseTreeNodeData>(
  treeData: T[],
  targetIds: React.ReactText[]
) => {
  if (targetIds.length === 0) return []

  const foundResult = [] as T[]
  const targetIdsSet = new Set(targetIds)

  const visitTree = (tree: any[]) => {
    if (targetIdsSet.size === 0) return

    const { length } = tree

    for (let i = 0; i < length; ++i) {
      const node = tree[i]

      if (targetIdsSet.has(node.id)) {
        foundResult.push(node)
        targetIdsSet.delete(node.id)

        if (targetIdsSet.size === 0) return
      }

      if (node.children) {
        visitTree(node.children)
      }
    }
  }

  visitTree(treeData)

  // 怎么处理 notfoundIds，给用户自己处理
  // targetIds.filter((id) => foundResult.find((item) => item.id !== id))

  return foundResult
}

/**
 * 从树中删除指定 id 的第一个被找到的节点
 * 并返回被删除节点
 *
 * @param treeData
 * @param targetId
 * @returns
 */
export const deleteNodeById = <T extends BaseTreeNode>(
  treeData: T[],
  targetId: React.ReactText,
  options?: { idFieldName?: string; childrenFieldName?: string }
) => {
  const { idFieldName = 'id', childrenFieldName = 'children' } = options || {}

  const { length } = treeData

  for (let i = 0; i < length; ++i) {
    const node = treeData[i]

    if (targetId === node[idFieldName]) {
      return treeData.splice(i, 1)
    }

    if (node[childrenFieldName]) {
      deleteNodeById(node[childrenFieldName], targetId, options)
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
export const addChildrenById = <T extends BaseTreeNode>(
  treeData: T[],
  targetId: React.ReactText,
  children: T[],
  key?: string
) => {
  const { length } = treeData
  for (let i = 0; i < length; ++i) {
    const node = treeData[i]

    if (targetId === node[key ?? 'id']) {
      node.children = children
    }

    if (node.children) {
      addChildrenById(node.children, targetId, children, key)
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
export const insertNodeById = <T extends BaseTreeNode>(
  treeData: T[],
  targetId: React.ReactText,
  sourceNode: T,
  position: 0 | 1,
  options?: { idFieldName?: string; childrenFieldName?: string }
) => {
  const { idFieldName = 'id', childrenFieldName = 'children' } = options || {}

  const { length } = treeData
  for (let i = 0; i < length; ++i) {
    const node = treeData[i]

    if (targetId === node[idFieldName]) {
      treeData.splice(i + position, 0, sourceNode)
      return
    }

    if (node[childrenFieldName]) {
      insertNodeById(node[childrenFieldName], targetId, sourceNode, position)
    }
  }
}

/**
 * 寻找某一节点的所有子节点
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
        // if (filter && filter(child) === false) return
        // allChildren.push(child)

        // 仅过滤当前节点，不过滤子树
        const filtered = filter && filter(child) === false

        if (!filtered) {
          allChildren.push(child as T)
        }

        dig(child)
      })
    }
  }

  dig(node)
  return allChildren
}

/**
 * 基于扁平树结构，获取根祖先节点
 */
export const getNodeRootParent = <T extends BaseFlattedTreeNodeDataWithParent>(node: T) => {
  let tNode = node

  // @ts-ignore
  while (tNode && tNode.depth > 0) {
    tNode = tNode.parent
  }

  return tNode
}

/**
 * 基于扁平树结构，获取祖先节点，不包含自身节点
 */
export const getNodeAncestors = <T extends BaseFlattedTreeNodeDataWithParent>(
  node: T,
  filter?: (item: any) => boolean | void,
  initialAncestors: T[] = []
) => {
  const ancestors = initialAncestors

  let tNode = node.parent

  while (tNode && tNode.parent) {
    // 仅过滤当前节点，不过滤子树
    const filtered = filter && filter(tNode) === false

    if (!filtered) {
      ancestors.push(tNode as T)
    }

    // 过滤节点及其子树
    // if (filter && filter(tNode) === false) break
    // ancestors.push(tNode)

    tNode = tNode.parent
  }

  return ancestors
}

/**
 * 基于扁平树结构，获取兄弟节点，包含自身节点
 */
export const getNodeSiblings = <T extends BaseFlattedTreeNodeDataWithParent>(node: T) => {
  const tNode = node.parent

  return tNode ? tNode.children : []
}

/**
 * 基于扁平树结构，获取祖先节点，包含自身节点
 */
export const getNodeAncestorsWithMe = <T extends BaseFlattedTreeNodeDataWithParent>(
  node: T,
  filter?: (item: any) => boolean | void
) => {
  return getNodeAncestors(node, filter, [node])
}

/**
 * 基于扁平树结构，获取自顶向下的祖先节点，包括自己
 */
export const getTopDownAncestors = <T extends BaseFlattedTreeNodeDataWithParent>(node: T) => {
  return getNodeAncestorsWithMe(node).reverse()
}

const copy = <T>(node: T) => ({ ...node })

export const cloneTreeNode = <T extends BaseTreeNode>(node: T) => {
  const nextTreeNode = copy(node)
  const dig = (node: BaseTreeNode) => {
    if (node.children) {
      node.children = node.children.map((child) => dig(copy(child)))
    }
    return node
  }
  dig(nextTreeNode)
  return nextTreeNode
}

/**
 * 递归浅拷贝树数据结构，避免数据循环引用处理
 */
export const cloneTree = <T extends BaseTreeNode>(tree: T[]) => {
  return tree.map((node) => cloneTreeNode(node))
}

export const isLeaf = <T extends BaseTreeNode>(treeNode: T) => {
  return !Array.isArray(treeNode.children) || treeNode.isLeaf
}

/**
 * 获取指定节点的所有后代叶子节点
 */
export const getLeafChildren = <T extends BaseTreeNode>(treeNode: T) => {
  const leafNodes: T[] = []

  const dig = (node: BaseTreeNode) => {
    if (node.children) {
      node.children.forEach((subNode) => {
        dig(subNode)
      })
    } else {
      leafNodes.push(node as T)
    }
  }

  dig(treeNode)

  return leafNodes
}

/**
 *  将树形数据按照层级分组
 */
export const groupByTreeDepth = <T extends BaseTreeNode>(tree: T[]) => {
  const groupedTree: T[][] = []

  visitTree(tree, (node) => {
    // TODO: remove using groupBy
    const depth = node.depth
    if (!groupedTree[depth]) {
      groupedTree[depth] = []
    }
    groupedTree[depth].push(node)
  })
  return groupedTree
}

export const filterTreeNode = <T extends BaseTreeNodeData>(
  node: T,
  filterFunc: (...arg: any[]) => boolean
) => {
  if (!filterFunc(node)) return false

  const dig = (node: BaseTreeNodeData) => {
    if (node.children) {
      node.children = node.children.filter((child) => {
        if (!filterFunc(child)) return false

        dig(child)
        return true
      })
    }
  }

  dig(node)
  return true
}

/**
 * 过滤树
 */
export const filterTree = <T extends BaseTreeNodeData>(
  tree: T[],
  filterFunc: (...arg: any[]) => boolean
) => {
  return cloneTree(tree).filter((node) => filterTreeNode(node, filterFunc))
}

/**
 * 基于树结构，获取所有祖先节点(非叶子节点)
 */
export const getTreeAncestors = <T extends BaseTreeNodeData>(tree: T[]) => {
  const ancestors = [] as T[]

  visitTree(tree, (node) => {
    if (node.children) {
      ancestors.push(node)
    }
  })

  return ancestors
}

/**
 * 基于树结构，获取所有存在子级的节点，返回节点的列表数组
 */
export const getTreeNodesWithChildren = <T extends BaseTreeNodeData>(tree: T[]) => {
  const nodes = [] as T[]

  visitTree(tree, (node) => {
    if (Array.isArray(node.children)) {
      nodes.push(node)
    }
  })

  return nodes
}
