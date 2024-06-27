import { isArray } from '@hi-ui/type-assertion'
import { DropdownTriggerActionEnum, DropdownDataItem } from '../types'
import { HiBaseFieldNameKeys, HiBaseFieldNames } from '@hi-ui/core'
import React from 'react'
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
  const getKeyFields = (node: DropdownDataItem, key: HiBaseFieldNameKeys) => {
    if (fieldNames) {
      return node[(fieldNames[key] || key) as keyof DropdownDataItem]
    }
    return node[key as keyof DropdownDataItem]
  }

  const traverseNode = (node: DropdownDataItem): DropdownDataItem => {
    const newNode: DropdownDataItem = { ...node }
    newNode.id = getKeyFields(newNode, 'id') as React.ReactText
    newNode.title = getKeyFields(newNode, 'title')
    newNode.href = getKeyFields(newNode, 'href' as HiBaseFieldNameKeys) as string
    newNode.disabled = (getKeyFields(newNode, 'disabled') ?? false) as boolean
    newNode.split = (getKeyFields(newNode, 'split' as HiBaseFieldNameKeys) ?? false) as boolean
    newNode.target = getKeyFields(newNode, 'target' as HiBaseFieldNameKeys) as
      | '_self'
      | '_blank'
      | '_parent'
      | '_top'

    return newNode
  }

  return data.map(traverseNode)
}
