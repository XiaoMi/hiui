import { BreadcrumbDataItem } from './types'

export const transformData = (
  data: BreadcrumbDataItem[],
  fieldNames: Record<string, string> | undefined
): BreadcrumbDataItem[] => {
  /**
   * 转换对象
   */
  const getKeyFields = (node: any, key: any) => {
    if (fieldNames) {
      return node[(fieldNames as any)[key] || key]
    }
    return node[key]
  }

  const traverseTreeNode = (node: BreadcrumbDataItem): BreadcrumbDataItem => {
    const newNode: BreadcrumbDataItem = { ...node }

    newNode.title = getKeyFields(newNode, 'title')
    newNode.href = getKeyFields(newNode, 'href')
    newNode.icon = getKeyFields(newNode, 'icon')
    newNode.target = getKeyFields(newNode, 'target')
    return newNode
  }

  return data.map(traverseTreeNode)
}
