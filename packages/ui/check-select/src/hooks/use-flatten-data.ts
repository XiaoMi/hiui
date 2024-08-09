import { useMemo } from 'react'
import { baseFlattenTree } from '@hi-ui/tree-utils'
import { HiBaseFieldNameKeys } from '@hi-ui/core'

const NOOP_ARRAY = [] as []
const DEFAULT_FIELD_NAMES = {} as any

export const useFlattenData = ({ data = NOOP_ARRAY, fieldNames = DEFAULT_FIELD_NAMES }: any) => {
  const flattedData = useMemo(() => {
    return flattenData({ data, fieldNames })
  }, [data, fieldNames])

  return flattedData
}

export const flattenData = ({ data = NOOP_ARRAY, fieldNames = DEFAULT_FIELD_NAMES }: any) => {
  // 转换对象
  const getKeyFields = (node: any, key: HiBaseFieldNameKeys) =>
    node[fieldNames[key] || key] ?? node[key]

  return baseFlattenTree({
    tree: data,
    childrenFieldName: (node) => getKeyFields(node, 'children'),
    transform: (node: any) => {
      // 不对外暴露
      delete node.parent

      const { raw } = node

      if ('groupId' in raw) {
        // 用于虚拟列表唯一 id
        node.id = raw.groupId
        node.groupId = raw.groupId
        node.groupTitle = raw.groupTitle
      } else {
        // 支持 fieldNames 转换
        node.id = getKeyFields(raw, 'id')
        node.title = getKeyFields(raw, 'title')
        node.disabled = getKeyFields(raw, 'disabled') ?? false
      }
      return node
    },
  })
}
