import { HiBaseFieldNameKeys, HiBaseFieldNames } from '@hi-ui/core'
import { TransferDataItem } from './types'
import React from 'react'
import { uuid } from '@hi-ui/use-id'

export const transformData = (
  data: TransferDataItem[],
  fieldNames?: HiBaseFieldNames
): TransferDataItem[] => {
  const getKeyFields = (node: TransferDataItem, key: HiBaseFieldNameKeys) => {
    if (fieldNames) {
      return node[(fieldNames[key] || key) as keyof TransferDataItem]
    }
    return node[key as keyof TransferDataItem]
  }

  const traverseNode = (node: TransferDataItem): TransferDataItem => {
    const newNode = { ...node }

    newNode.id = (getKeyFields(newNode, 'id') as React.ReactText) ?? uuid()
    newNode.title = getKeyFields(newNode, 'title') as React.ReactNode
    newNode.disabled = (getKeyFields(newNode, 'disabled') ?? false) as boolean

    return newNode
  }

  return data.map(traverseNode) as TransferDataItem[]
}
