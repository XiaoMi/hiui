import { HiBaseFieldNameKeys, HiBaseFieldNames } from '@hi-ui/core'
import { SearchDataItem } from './types'
import React from 'react'

export const transformData = (
  data: SearchDataItem[],
  fieldNames?: HiBaseFieldNames
): SearchDataItem[] => {
  /**
   * 转换对象
   */
  const getKeyFields = (node: SearchDataItem, key: HiBaseFieldNameKeys) => {
    if (fieldNames) {
      return (
        node[(fieldNames[key] || key) as keyof SearchDataItem] ?? node[key as keyof SearchDataItem]
      )
    }
    return node[key as keyof SearchDataItem]
  }

  const traverseTreeNode = (node: SearchDataItem): SearchDataItem => {
    const newNode: SearchDataItem = { ...node }

    newNode.id = getKeyFields(newNode, 'id') as React.ReactText
    newNode.title = getKeyFields(newNode, 'title') as string
    newNode.children = getKeyFields(newNode, 'children') as SearchDataItem[]
    if (newNode.children) newNode.children = newNode.children.map(traverseTreeNode)

    return newNode
  }

  return data.map(traverseTreeNode)
}
