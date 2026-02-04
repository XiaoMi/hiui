import { SELECTED_OPTION_RAW } from '@hi-ui/schema-core'
import type { CheckSelectDataItem } from '@hi-ui/check-select'
import type { CheckTreeSelectDataItem } from '@hi-ui/check-tree-select'
import type { BuiltinFieldMapType } from '@hi-ui/schema-fields'
import type { ValueType } from '@hi-ui/schema-core'
import type { FilteredCascaderDataItem } from '@hi-ui/schema-utils'

export type SelectComponentType = keyof Pick<
  BuiltinFieldMapType,
  'select' | 'check-select' | 'tree-select' | 'cascader' | 'check-cascader' | 'check-tree-select'
>

/**
 * 获取选择器组件的显示标题
 * @param rowData 行数据
 * @param componentType 组件类型
 * @param fieldKey 字段名，用于区分同一行的不同字段
 * @returns 显示标题
 */
export function getSelectedOptionTitle(
  rowData: Record<string, AnyObject> | undefined,
  componentType: ValueType,
  fieldKey: string
): string | string[] | undefined {
  // 获取改行所有的选择器组件的onchange的回调参数
  const selectedRawOption = rowData?.[SELECTED_OPTION_RAW]

  if (!selectedRawOption) {
    return undefined
  }

  // 根据fieldKey获取对应字段获取onchange的回调参数
  const onChangeArgs = selectedRawOption[fieldKey]

  if (!onChangeArgs) {
    return undefined
  }

  switch (componentType) {
    case 'select': {
      // onChangeArgs 结构: ((selectedId: ReactText, changedItem: SelectItemEventData) => void)
      const { title } = onChangeArgs[1] || {}
      return title as string
    }

    case 'check-select': {
      // onChangeArgs 结构: ((value: ReactText[], changedItems: CheckSelectDataItem[], checkedItems: CheckSelectDataItem[]) => void)
      const titles = onChangeArgs[2]?.map((item: CheckSelectDataItem) => item.title) || []
      return titles as string[]
    }

    case 'tree-select': {
      // onChangeArgs 结构: ((selectedId: ReactText, selectedItem: TreeSelectDataItem) => void)
      const { title } = onChangeArgs[1] || {}
      return title as string
    }

    case 'check-tree-select': {
      // onChangeArgs 结构: ((checkedIds: ReactText[], options: { checkedNodes: CheckTreeSelectDataItem[]; semiCheckedIds: ReactText[]; targetNode: CheckTreeSelectItemEventData | null; checked: boolean; }) => void)
      const { checkedNodes } = onChangeArgs[1] || {}
      return checkedNodes?.map((item: CheckTreeSelectDataItem) => item.title) || ([] as string[])
    }

    case 'cascader': {
      const flattedItems = (onChangeArgs[2] as FilteredCascaderDataItem[]) ?? []
      return flattedItems.map((item) => item.title ?? 'empty').join('/')
    }

    case 'check-cascader': {
      // TODO: 实现check-cascader的title获取逻辑，目前HIUI的onchange事件没有回显title
      return undefined
    }

    default: {
      console.warn(`不支持的组件类型: ${componentType}`)
      return undefined
    }
  }
}
