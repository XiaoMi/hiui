import { HiBaseFieldNames } from "@hi-ui/core"
import { ListDataItem } from "./types"

export const  transformData = (
  data: ListDataItem[],
  fieldNames?: HiBaseFieldNames
  ) : ListDataItem[] => {

    const getKeyFields = (node: any, key: any)=> {
      if(fieldNames){
        return node[(fieldNames as any)[key] || key]
      }
      return node[key]
    }

    const traverseNode = (node: ListDataItem ): ListDataItem => {
      const newNode: ListDataItem = {...node}

      newNode.title = getKeyFields(newNode, 'title')
      newNode.description = getKeyFields(newNode, 'description')
      newNode.extra = getKeyFields(newNode, 'extra')
      newNode.avatar = getKeyFields(newNode, 'avatar')
      newNode.action = getKeyFields(newNode, 'action')
      newNode.actionPlacement = getKeyFields(newNode, 'actionPlacement')

      return newNode
  }

  return data.map(node => traverseNode(node))


}

