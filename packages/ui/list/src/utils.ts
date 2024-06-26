import { HiBaseFieldNameKeys, HiBaseFieldNames } from '@hi-ui/core'
import { ListDataItem, ListActionPlacementEnum } from './types'

export const transformData = (
  data: ListDataItem[],
  fieldNames?: HiBaseFieldNames
): ListDataItem[] => {
  const getKeyFields = (node: ListDataItem, key: HiBaseFieldNameKeys) => {
    if (fieldNames) {
      return node[(fieldNames[key] || key) as keyof ListDataItem]
    }
    return node[key as keyof ListDataItem]
  }

  const traverseNode = (node: ListDataItem): ListDataItem => {
    const newNode: ListDataItem = { ...node }

    newNode.title = getKeyFields(newNode, 'title' as HiBaseFieldNameKeys)
    newNode.description = getKeyFields(newNode, 'description' as HiBaseFieldNameKeys)
    newNode.extra = getKeyFields(newNode, 'extra' as HiBaseFieldNameKeys)
    newNode.avatar = getKeyFields(newNode, 'avatar' as HiBaseFieldNameKeys)
    newNode.action = getKeyFields(newNode, 'action' as HiBaseFieldNameKeys)
    newNode.actionPlacement = getKeyFields(
      newNode,
      'actionPlacement' as HiBaseFieldNameKeys
    ) as ListActionPlacementEnum

    return newNode
  }

  return data.map((node) => traverseNode(node))
}
