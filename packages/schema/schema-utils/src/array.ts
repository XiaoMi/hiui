/* eslint-disable no-redeclare */
import { isNil } from 'lodash-es'

/**
 * array2map
 * - 根据指定的 key 字段和 value 字段，将数组转换为 map
 * - `([{ id: '1', name: 'item1', value: 100 }], 'id', 'value') => { '1': 100 }`
 */
export function array2map<TData, TKey extends keyof TData>(
  arr: TData[],
  key: keyof TData,
  value: TKey
) {
  try {
    return arr.reduce((acc, item) => {
      const thisKey = item[key] as string
      if (isNil(thisKey) || thisKey === '') return acc

      acc[thisKey] = item[value]
      return acc
    }, {} as Record<string, TData[TKey]>)
  } catch (error) {
    console.log('array2map', error)
    return {} as Record<string, TData[TKey]>
  }
}

/**
 * array2recordMap
 * - 根据指定的 key 字段，将数组转换为 record map
 * - `([{ id: '1', name: 'item1' }], 'id') => { '1': { id: '1', name: 'item1' } }`
 */
// 函数重载：不传 map 函数时返回原始数据类型
export function array2recordMap<TData, TKey extends keyof TData>(
  arr: TData[],
  key: TKey,
  extra?: {
    useIdx?: boolean
  }
): Record<string & TData[TKey], TData>

// 函数重载：传 map 函数时返回映射后的数据类型
export function array2recordMap<TData, TMappedData, TKey extends keyof TData>(
  arr: TData[],
  key: TKey,
  extra: {
    useIdx?: boolean
    map: (item: TData, idx: number) => TMappedData
  }
): Record<string & TData[TKey], TMappedData>

// 实现
export function array2recordMap<TData, TMappedData>(
  arr: TData[],
  key: keyof TData,
  extra?: {
    useIdx?: boolean
    map?: (item: TData, idx: number) => TMappedData
  }
): Record<string, TData | TMappedData> {
  try {
    return arr.reduce((acc, item, idx) => {
      const thisKey = extra?.useIdx ? idx : (item[key] as string)
      if (isNil(thisKey) || thisKey === '') return acc

      acc[thisKey] = extra?.map ? extra.map(item, idx) : item
      return acc
    }, {} as Record<string, TData | TMappedData>)
  } catch (error) {
    console.log('array2recordMap', error)
    return {} as Record<string, TData | TMappedData>
  }
}

export function toArray<T>(val: T | T[]) {
  return Array.isArray(val) ? val : [val]
}
