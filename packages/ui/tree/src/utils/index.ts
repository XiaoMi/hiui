import { fFindNodeById } from './tree'
import React from 'react'
import { TreeNodeEventData, FlattedTreeNodeData, TreeNodeRequiredProps } from '../types'
import { isTreeRoot } from '@hi-ui/tree-utils'
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
          let children: any[] = []
          if (node.children && node.children.length > 0) {
            children = node.children
          }

          if (children.length === 0) {
            return true
          }

          if (children.every((node) => keySet.has(node.id))) {
            return false
          }
        }
        return true
      })

    case 'PARENT':
      return checkedIds.filter((id) => {
        const node = fFindNodeById(flattenData, id)
        const parent = node ? node.parent : null
        if (!isTreeRoot(parent) && keySet.has(parent.id)) {
          return false
        }
        return true
      })
  }

  return checkedIds
}
