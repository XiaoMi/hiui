import { fFindNodeById } from './tree'
import React from 'react'
import { TreeNodeEventData, FlattedTreeNodeData, TreeNodeRequiredProps } from '../types'
import { findNestedChildren, getNodeAncestors } from '@hi-ui/tree-utils'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'
export * from './tree'

/**
 * 生成 uuid
 *
 * @returns unique id
 */
export const uuid = () => Math.random().toString(36).substring(5).split('').join('.')

export const getBeforeAfter = <T>(before: T, after: T) => ({ before, after })

export function getTreeNodeEventData(
  node: FlattedTreeNodeData,
  requiredProps: TreeNodeRequiredProps
): TreeNodeEventData {
  return {
    ...node,
    ...requiredProps,
  }
}

/**
 * 处理选中的回显数据
 *
 * @param checkedIds 当前所有被选中的节点 ID 集合
 * @param nodeEntries 所有数据的Map 集合
 * @param type 数据回显方式
 */
export const processCheckedIds = (
  type: string,
  checkedIds: React.ReactText[],
  flattenData: any
) => {
  const keySet = new Set(checkedIds)

  switch (type) {
    case 'CHILD':
      return checkedIds.filter((id) => {
        const node = fFindNodeById(flattenData, id)

        if (node) {
          const { children } = node

          if (isArrayNonEmpty(children)) {
            if (children.filter((node) => !node.disabled).every((node) => keySet.has(node.id))) {
              return false
            }
          }
        }

        // 没有孩子节点，保留
        return true
      })

    case 'PARENT':
      return checkedIds.filter((id) => {
        const node = fFindNodeById(flattenData, id)
        if (node) {
          // 向上递归遍历是否被勾选
          const ancestors = getNodeAncestors(node)

          if (ancestors.some((parent) => keySet.has(parent.id))) {
            return false
          }
        }

        return true
      })
  }

  return checkedIds
}

/**
 * 根据传入的 checkedIds 解析全选/半选数据
 */
export const parseCheckDataDirty = (
  type: string,
  checkedIds: React.ReactText[],
  flattenData: any
) => {
  switch (type) {
    case 'CHILD':
    case 'PARENT':
      return dirtyCheck(checkedIds, flattenData, (node: any) => !node.disabled)
  }

  return checkedIds
}

function dirtyCheck(checkedIds: React.ReactText[], flattenData: any[], allowCheck?: Function) {
  const nodeEntities = flattenData.reduce((prev, cur) => {
    prev[cur.id] = cur
    return prev
  }, {} as any)

  const checkedIdsSet = new Set<React.ReactText>(checkedIds.filter((id) => !!nodeEntities[id]))

  const depthEntities = new Map<number, Set<any>>()
  let maxDepth = 0

  // Convert entities by depth for calculation
  Object.keys(nodeEntities).forEach((id) => {
    const entity = nodeEntities[id]
    const { depth } = entity

    let depthSet = depthEntities.get(depth)

    if (!depthSet) {
      depthSet = new Set()
      depthEntities.set(depth, depthSet)
    }

    depthSet.add(entity)

    maxDepth = Math.max(maxDepth, depth)
  })

  return fillCheck(checkedIdsSet, depthEntities, nodeEntities, maxDepth, allowCheck)
}

/**
 *  对 checkedIds 级联遗漏选项 id 填充
 *
 *  1. 把所有嵌套孩子节点 allowCheck 的都标记为 checked
 *  2. 祖先节点从下至上维护 checked 状态
 */
function fillCheck(
  checkedIds: Set<React.ReactText>,
  depthEntities: Map<number, Set<any>>,
  nodeEntities: Record<React.ReactText, any>,
  maxDepth: number,
  allowCheck: any
) {
  const checkedIdsSet = new Set<React.ReactText>(checkedIds)

  checkedIdsSet.forEach((id) => {
    const checkedNode = nodeEntities[id]
    const nestedChildren = findNestedChildren(checkedNode, allowCheck)

    nestedChildren.forEach((child) => {
      checkedIdsSet.add(child.id)
    })
  })

  // 缓存中间结果，优化递归查询
  const visitedIds = new Map<React.ReactText, boolean>()

  for (let depth = maxDepth - 1; depth >= 0; --depth) {
    const entities = depthEntities.get(depth)
    entities?.forEach((entity) => {
      const { id, children } = entity

      if (visitedIds.has(id)) return

      if (isArrayNonEmpty(children)) {
        const shouldChecked = !children.some((child: any) => {
          if (visitedIds.has(child.id)) {
            return !visitedIds.get(child.id)
          }

          return !checkedIdsSet.has(child.id)
        })

        visitedIds.set(id, shouldChecked)

        if (shouldChecked && allowCheck(entity)) {
          checkedIdsSet.add(id)
        }
      }
    })
  }

  return Array.from(checkedIdsSet)
}
