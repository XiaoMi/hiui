import { HiBaseFieldNameKeys, HiBaseFieldNames } from '@hi-ui/core'
import { StepperDataItem } from './types'
import React from 'react'

export const transformData = (
  data: StepperDataItem[],
  fieldNames?: HiBaseFieldNames
): StepperDataItem[] => {
  const getKeyFields = (node: StepperDataItem, key: HiBaseFieldNameKeys) => {
    if (fieldNames) {
      return (
        node[(fieldNames[key] || key) as keyof StepperDataItem] ??
        node[key as keyof StepperDataItem]
      )
    }
    return node[key as keyof StepperDataItem]
  }

  const traverseNode = (node: StepperDataItem) => {
    const newNode: StepperDataItem = { ...node }

    newNode.title = getKeyFields(newNode, 'title') as React.ReactNode
    newNode.content = getKeyFields(newNode, 'content' as HiBaseFieldNameKeys) as React.ReactNode
    newNode.icon = getKeyFields(newNode, 'icon' as HiBaseFieldNameKeys) as React.ReactNode

    return newNode
  }

  return data.map((node) => traverseNode(node))
}
