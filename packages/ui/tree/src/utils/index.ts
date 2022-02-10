import { fFindNodeById } from './tree'
import React from 'react'
import { TreeNodeEventData, FlattedTreeNodeData, TreeNodeRequiredProps } from '../types'
import { getNodeAncestors } from '@hi-ui/tree-utils'
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
