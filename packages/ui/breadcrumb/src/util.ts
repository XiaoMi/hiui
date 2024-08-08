import { HiBaseFieldNameKeys, HiBaseFieldNames } from '@hi-ui/core'
import { BreadcrumbDataItem, BreadcrumbDataItemTargetEnum } from './types'
import React from 'react'

export const transformData = (
  data: BreadcrumbDataItem[],
  fieldNames?: HiBaseFieldNames
): BreadcrumbDataItem[] => {
  /**
   * 转换对象
   */
  const getKeyFields = (node: BreadcrumbDataItem, key: HiBaseFieldNameKeys) => {
    if (fieldNames) {
      return (
        node[(fieldNames[key] || key) as keyof BreadcrumbDataItem] ??
        node[key as keyof BreadcrumbDataItem]
      )
    }
    return node[key as keyof BreadcrumbDataItem]
  }

  const traverseNode = (node: BreadcrumbDataItem): BreadcrumbDataItem => {
    const newNode: BreadcrumbDataItem = { ...node }

    newNode.title = getKeyFields(newNode, 'title')
    newNode.href = getKeyFields(newNode, 'href' as HiBaseFieldNameKeys) as string
    newNode.icon = getKeyFields(newNode, 'icon' as HiBaseFieldNameKeys) as React.ReactNode
    newNode.target = getKeyFields(
      newNode,
      'target' as HiBaseFieldNameKeys
    ) as BreadcrumbDataItemTargetEnum

    return newNode
  }

  return data.map(traverseNode)
}
