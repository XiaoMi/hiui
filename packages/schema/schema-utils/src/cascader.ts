import type React from 'react'
import { omit } from 'lodash-es'
import { CascaderItemEventData, FlattedCascaderDataItem } from '@hi-ui/cascader'
import { CheckCascaderItemEventData, FlattedCheckCascaderDataItem } from '@hi-ui/check-cascader'

export type FilteredCascaderItemEventData = Omit<CascaderItemEventData, 'parent' | 'children'>
export type FilteredCheckCascaderItemEventData = Omit<
  CheckCascaderItemEventData,
  'parent' | 'children'
>
export type FilteredCascaderDataItem = Omit<FlattedCascaderDataItem, 'parent' | 'children'>
export type FilteredCheckCascaderDataItem = Omit<
  FlattedCheckCascaderDataItem,
  'parent' | 'children'
>

/**
 * 解决级联选择器选项信息中的自引用问题
 * 递归遍历对象，当depth为0时删除parent属性，避免循环引用
 */
export function filterCascaderSelfReferenceOpts(
  value: React.ReactText[] | React.ReactText[][],
  targetOption?: CascaderItemEventData | CheckCascaderItemEventData,
  optionPaths?: FlattedCascaderDataItem[] | FlattedCheckCascaderDataItem[]
): [
  React.ReactText[] | React.ReactText[][],
  FilteredCascaderItemEventData | FilteredCheckCascaderItemEventData | undefined,
  FilteredCascaderDataItem[] | FilteredCheckCascaderDataItem[] | undefined
] {
  // 第一个值不需要处理
  const nextValue = value

  const removeKeys = ['parent', 'children'] as const

  // 处理第二个值：选中的元素对应的选项信息
  const nextTargetOption = targetOption ? omit(targetOption, removeKeys) : targetOption

  // 处理第三个值：选中项对应的全部平铺开的选项信息
  const nextOptionPaths = optionPaths
    ? optionPaths.map((item: FlattedCascaderDataItem | FlattedCheckCascaderDataItem) =>
        omit(item, removeKeys)
      )
    : optionPaths

  return [nextValue, nextTargetOption, nextOptionPaths]
}
