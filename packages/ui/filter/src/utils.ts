import { FilterDataItem } from './types'

export const transformTreeData = (data: FilterDataItem[] , fieldNames?: Record<string, string>) : FilterDataItem[] => {
  const getKeyFields = (node: any, key: any) => {
    if(fieldNames ){
      return node[(fieldNames as any)[key] || key]
    }
    return node[key]
  }

  const traverseNode = (node: FilterDataItem) : FilterDataItem => {
    const newNode = { ...node }
    newNode.id = getKeyFields(newNode, 'id')
    newNode.title = getKeyFields(newNode, 'title')
    newNode.disabled = getKeyFields(newNode, 'disabled')?? false
    newNode.children = getKeyFields(newNode, 'children')
    if(newNode.children){
      newNode.children = newNode.children.map(traverseNode)
    }
    return newNode
  }

  return data.map(traverseNode)
}
