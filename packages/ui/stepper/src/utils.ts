import { HiBaseFieldNames } from "@hi-ui/core";
import { StepperDataItem } from "./types";


export const transformData = (data: StepperDataItem[], fieldNames?: HiBaseFieldNames): StepperDataItem[] => {

  const getKeyFields = (node: any, key: any) => {
    if(fieldNames){
      return node[(fieldNames as any)[key] || key]
    }
    return node[key]
  }

  const traverseNode = (node : StepperDataItem) => {
    const newNode = { ...node }
    newNode.title = getKeyFields(newNode, 'title')
    newNode.content = getKeyFields(newNode, 'content')
    newNode.icon = getKeyFields(newNode, 'icon')
    return newNode
  }

  return data.map((node) => traverseNode(node))
}
