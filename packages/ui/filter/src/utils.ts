import { HiBaseFieldNameKeys, HiBaseFieldNames } from "@hi-ui/core"
import { FilterDataItem } from "./types"

export const transformTreeData = (
  data: FilterDataItem[],
  fieldNames?: HiBaseFieldNames
): FilterDataItem[] => {
  const getKeyFields = (node: FilterDataItem, key: HiBaseFieldNameKeys) => {
    if (fieldNames) {
      return node[(fieldNames[key] || key) as keyof FilterDataItem]
    }
    return node[key]
  }

  const traverseNode = (node: FilterDataItem): FilterDataItem => {
    const newNode: FilterDataItem = { ...node }

    newNode.id = getKeyFields(newNode, "id") as React.ReactText
    newNode.title = getKeyFields(newNode, "title") as React.ReactText
    newNode.disabled = (getKeyFields(newNode, "disabled") ?? false) as boolean
    newNode.children = getKeyFields(newNode, "children") as FilterDataItem[]

    if (newNode.children) {
      newNode.children = newNode.children.map(traverseNode)
    }
    return newNode
  }

  return data.map(traverseNode)
}
