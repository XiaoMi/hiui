import React from 'react'
import type { FieldConfigType } from '@hi-ui/schema-core'
import type { EditableCaseProps } from './editable'

export type SimpleCaseProps = Pick<EditableCaseProps, 'value'>

/**
 * 简单字段且无自定义渲染，使用 SimpleCase
 */
export function isSimpleCase(field: FieldConfigType) {
  const customRender = field?.renderer
  if (customRender?.renderCell || customRender?.render) return false

  return field.control?.simple
}

export function SimpleCase(props: SimpleCaseProps) {
  const { value } = props

  // NOTE：此处 SimpleCase 的结构和样式说明
  // 简单场景时，实际上可以使用 :not(:has(*)) 来直接选中这种仅包含文本的单元格
  // 但是 :not(:has(*)) 的兼容性不好，所以此处使用 span[data-case='simple'] 来选中
  // 若后续 :has 的兼容性提升，则可以考虑删除此处的 span 标签，进一步降低渲染成本
  // 此处注释在样式位置中也有相同的一份~
  if (value === undefined || value === null || value === '')
    return <span data-case="simple">-</span>

  // 如果 value 是对象，则直接显示 JSON 字符串
  if (typeof value === 'object') {
    try {
      return <span data-case="simple">{JSON.stringify(value)}</span>
    } catch (error) {
      console.error('SimpleCase Failed to stringify object', error)
      return <span data-case="simple">[Object Unknown]</span>
    }
  }

  return <span data-case="simple">{value}</span>
}
