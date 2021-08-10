import { TreeNodeEventData, FlattedTreeNodeData, TreeNodeRequiredProps } from '../types'
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
