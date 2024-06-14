import { SearchDataItem } from './types'

export const transformData = (
  data: SearchDataItem[],
  fieldNames: Record<string, string> | undefined
): SearchDataItem[] => {
  /**
   * 转换对象
   */
  const getKeyFields = (node: any, key: any) => {
    if (fieldNames) {
      return node[(fieldNames as any)[key] || key]
    }
    return node[key]
  }

  const traverseTreeNode = (node: SearchDataItem): SearchDataItem => {
    const newNode: SearchDataItem = { ...node }

    newNode.id = getKeyFields(newNode, 'id')
    newNode.title = getKeyFields(newNode, 'title')
    newNode.children = getKeyFields(newNode, 'children')
    if (newNode.children) newNode.children = newNode.children.map(traverseTreeNode)

    return newNode
  }

  return data.map(traverseTreeNode)
}
