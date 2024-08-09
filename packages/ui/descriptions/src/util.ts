import * as React from 'react'
import { DescriptionsItemProps } from './DescriptionsItem'
import { HiBaseFieldNameKeys, HiBaseFieldNames } from '@hi-ui/core'

type AnyObject = Record<any, any>

type RenderProps = undefined | AnyObject | ((originProps: AnyObject) => AnyObject | undefined)

export function cloneElement(element: React.ReactElement, props?: RenderProps) {
  if (!React.isValidElement(element)) return element

  return React.cloneElement(element, props)
}

export function toArray(children: React.ReactNode) {
  const res: any = []
  React.Children.forEach(children, (c) => {
    res.push(c)
  })
  return res
}

export const transformData = (data: DescriptionsItemProps[], fieldNames?: HiBaseFieldNames) => {
  /**
   * 转换对象
   */
  const getKeyFields = (node: DescriptionsItemProps, key: HiBaseFieldNameKeys) => {
    if (fieldNames) {
      return (
        node[(fieldNames[key] || key) as keyof DescriptionsItemProps] ??
        node[key as keyof DescriptionsItemProps]
      )
    }
    return node[key as keyof DescriptionsItemProps]
  }

  const traverseNode = (node: DescriptionsItemProps): DescriptionsItemProps => {
    const newNode: DescriptionsItemProps = { ...node }

    newNode.label = getKeyFields(newNode, 'label' as HiBaseFieldNameKeys)
    newNode.value = getKeyFields(newNode, 'value' as HiBaseFieldNameKeys)
    newNode.labelWidth = getKeyFields(newNode, 'labelWidth' as HiBaseFieldNameKeys)
    newNode.labelPlacement = getKeyFields(newNode, 'labelPlacement' as HiBaseFieldNameKeys)

    return newNode
  }

  return data.map(traverseNode)
}
