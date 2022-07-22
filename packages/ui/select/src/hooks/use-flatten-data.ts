import { useMemo } from 'react'
import { baseFlattenTree } from '@hi-ui/tree-utils'

const NOOP_ARRAY = [] as []
const DEFAULT_FIELD_NAMES = {} as any

export const useFlattenData = ({ data = NOOP_ARRAY, fieldNames = DEFAULT_FIELD_NAMES }: any) => {
  const flattedData = useMemo(() => {
    const getKeyFields = (node: any, key: string) => node[fieldNames[key] || key]

    return baseFlattenTree({
      tree: data,
      childrenFieldName: (node) => getKeyFields(node, 'children'),
      transform: (node: any) => {
        // 不对外暴露
        delete node.parent

        if ('groupId' in node.raw) {
          // 用于虚拟列表唯一 id
          node.id = node.raw.groupId
          node.groupId = node.raw.groupId
          node.groupTitle = node.raw.groupTitle
        } else {
          node.id = getKeyFields(node.raw, 'id')
          node.title = getKeyFields(node.raw, 'title')
          node.disabled = getKeyFields(node.raw, 'disabled') ?? false
        }
        return node
      },
    })
  }, [data, fieldNames])

  return flattedData
}
