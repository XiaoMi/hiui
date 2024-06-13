import * as React from 'react'
import { DescriptionsItemProps } from './DescriptionsItem'

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

export const transformData = (
  data: DescriptionsItemProps[],
  fieldNames: Record<string, string> | undefined
) => {
  /**
   * 转换对象
   */
  const getKeyFields = (node: any, key: any) => {
    if (fieldNames) {
      return node[(fieldNames as any)[key] || key]
    }
    return node[key]
  }

  const traverseNode = (node: DescriptionsItemProps): DescriptionsItemProps => {
    const newNode: DescriptionsItemProps = { ...node }
    newNode.label = getKeyFields(newNode, 'label')
    newNode.value = getKeyFields(newNode, 'value')
    newNode.labelWidth = getKeyFields(newNode, 'labelWidth')
    newNode.labelPlacement = getKeyFields(newNode, 'labelPlacement')
    return newNode
  }

  return data.map(traverseNode)
}
