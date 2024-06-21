import { TransferDataItem } from "./types";


export const transformData = (data: TransferDataItem[],
  fieldNames: Record<string, string> | undefined
  ):  TransferDataItem[] => {
    const getKeyFields = (node: any, key: any) => {
      if(fieldNames ){
        return node[(fieldNames as any)[key] || key]
      }
      return node[key]
    }

    const traverseNode = (node: TransferDataItem): TransferDataItem => {
      const newNode = { ...node }

      newNode.id = getKeyFields(newNode, 'id')
      newNode.title = getKeyFields(newNode, 'title')
      newNode.disabled = getKeyFields(newNode, 'disabled')?? false

      return newNode
    }

    return data.map(traverseNode) as TransferDataItem[]

  }
