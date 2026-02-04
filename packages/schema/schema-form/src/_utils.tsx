import { createPrefixClassnames } from '@hi-ui/schema-utils'
import type { FormItemProps } from './type'

export const clsPrefix = 'schema-form'
export const cls = createPrefixClassnames(clsPrefix)

export function extractLabelProps(props: FormItemProps) {
  const {
    // props
    labelPlacement,
    required,
    showColon,
    labelWidth,
    contentPosition,
    showValidateMessage,
  } = props

  return {
    labelPlacement,
    required,
    showColon,
    labelWidth,
    contentPosition,
    showValidateMessage,
  }
}

export type DataIndexType = string | number | string[] | (string | number | (string | number)[])[]
export type NormalizedDataIndexType = (string | number)[]
export function normalizeDataIndex(dataIndex: DataIndexType): NormalizedDataIndexType {
  if (typeof dataIndex === 'string' || typeof dataIndex === 'number') {
    return [dataIndex]
  }

  function flattenDeep(arr: Exclude<DataIndexType, Primitive>): (string | number)[] {
    return arr.flatMap((item: string | number | (string | number)[]) => {
      if (Array.isArray(item)) return flattenDeep(item)
      return [item]
    })
  }

  return flattenDeep(dataIndex)
}
