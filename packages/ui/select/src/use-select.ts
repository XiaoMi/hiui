import React, { useMemo } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useSelect as useSelectDefault } from '@hi-ui/use-check'
import { FieldNames, FieldNamesKeys, SelectDataItem } from './types'
import { flattenTree1 } from '@hi-ui/tree-utils'

const NOOP_ARRAY = [] as []
const NOOP_VALUE = ''
const DEFAULT_FIELD_NAMES = {} as any

const allowSelect = (option: any) => !option.disabled

export const useSelect = ({
  data = NOOP_ARRAY,
  disabled = false,
  value: valueProp,
  defaultValue = NOOP_VALUE,
  onChange: onChangeProp,
  onSelect: onSelectProp,
  fieldNames = DEFAULT_FIELD_NAMES,
  ...rest
}: UseSelectProps) => {
  const flattedData = useMemo(() => {
    const getKeyFields = (node: any, key: FieldNamesKeys) => node[fieldNames[key] || key]

    return flattenTree1({
      tree: data,
      childrenFieldName: (node) => getKeyFields(node, 'children'),
      transform: (node: any) => {
        if ('groupId' in node.raw) {
          node.id = node.raw.groupId
          node.groupId = node.raw.groupId
          node.groupTitle = node.raw.groupTitle
        } else {
          node.id = getKeyFields(node.raw, 'id')
          node.title = getKeyFields(node.raw, 'title')
          node.disabled = getKeyFields(node.raw, 'disabled')
        }
        return node
      },
    })
  }, [data, fieldNames])

  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChangeProp)

  const [onSelect, isSelectedId] = useSelectDefault({
    disabled,
    allowSelect,
    selectedId: value,
    onSelect: (value: React.ReactText, item: SelectDataItem) => {
      tryChangeValue(value, item)
      onSelectProp?.(value, item)
    },
  })

  const rootProps = rest

  return {
    rootProps,
    data,
    flattedData,
    value,
    tryChangeValue,
    onSelect,
    isSelectedId,
  }
}

export interface UseSelectProps {
  /**
   * 选项数据
   */
  data?: SelectDataItem[]
  /**
   * 设置 data 中 id, title, disabled, children 对应的 key
   */
  fieldNames?: FieldNames
  /**
   * 设置当前选中值
   */
  value?: React.ReactText
  /**
   * 设置当前选中值默认值
   */
  defaultValue?: React.ReactText
  /**
   * 选中值改变时的回调
   */
  onChange?: (
    selectedId: React.ReactText,
    changedItem: SelectDataItem,
    shouldChecked: boolean
  ) => void
  /**
   * 选中值时回调
   */
  onSelect?: (value: React.ReactText, targetOption?: SelectDataItem) => void
  /**
   * 是否禁止使用
   */
  disabled?: boolean
}

export type UseSelectReturn = ReturnType<typeof useSelect>
