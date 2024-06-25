import { isArray } from '@hi-ui/type-assertion'
import { DropdownTriggerActionEnum, DropdownDataItem } from '../types'
import { HiBaseFieldNames } from '@hi-ui/core'

/**
 * 抹平 trigger 结构为数组
 *
 * @param trigger
 * @returns
 */
export const normalizeTrigger = (
  trigger: DropdownTriggerActionEnum | DropdownTriggerActionEnum[]
) => (isArray(trigger) ? Array.from(new Set(trigger)) : [trigger])

export const transformData = (
  data: DropdownDataItem[],
  fieldNames?: HiBaseFieldNames
): DropdownDataItem[] => {
  /**
   * 转换对象
   */
  const getKeyFields = (node: any, key: any) => {
    if (fieldNames) {
      return node[(fieldNames as any)[key] || key]
    }
    return node[key]
  }

  const traverseNode = (node: DropdownDataItem): DropdownDataItem => {
    const newNode: DropdownDataItem = { ...node }
    newNode.id = getKeyFields(newNode, 'id')
    newNode.title = getKeyFields(newNode, 'title')
    newNode.href = getKeyFields(newNode, 'href')
    newNode.disabled = getKeyFields(newNode, 'disabled') ?? false
    newNode.split = getKeyFields(newNode, 'split') ?? false
    newNode.target = getKeyFields(newNode, 'target')

    return newNode
  }

  return data.map(traverseNode)
}
