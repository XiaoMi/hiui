import React, { useCallback, useMemo } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
// import { useSearch } from './hooks'
import { useCheck as useCheckDefault } from '@hi-ui/use-check'
import { CheckSelectDataGroupItem, CheckSelectDataItem, CheckSelectEventData } from './types'
import { useLatestCallback, useLatestRef } from '@hi-ui/use-latest'
import { toArray } from '@hi-ui/use-children'
import { flattenTree } from '@hi-ui/tree-utils'

const NOOP_ARRAY = [] as []
const NOOP_VALUE = [] as []
const DEFAULT_FIELD_NAMES = {} as any

export const useCheckSelect = ({
  data: dataProp = NOOP_ARRAY,
  children,
  disabled = false,
  value: valueProp,
  defaultValue = NOOP_VALUE,
  onChange: onChangeProp,
  onSelect,
  emptyContent = '无匹配选项',
  searchPlaceholder,
  filter,
  fieldNames = DEFAULT_FIELD_NAMES,
  ...rest
}: UseCheckSelectProps) => {
  const data = useMemo(() => {
    // @private
    if (children) {
      const dfs = (child: any) => {
        const arr: any[] = []
        const list = toArray(child)

        list.forEach((item) => {
          if (!React.isValidElement(item)) return

          // @ts-ignore
          if (item.type.HiName === 'CheckSelectOption') {
            const { props } = item as any
            const { value, children, disabled, groupTitle, ...rest } = props
            const option = {
              id: value,
              title: children,
              disabled: disabled,
              rootProps: rest,
            } as CheckSelectDataItem
            arr.push(option)
            // @ts-ignore
          } else if (item.type.HiName === 'CheckSelectOptionGroup') {
            const { props } = item as any
            const { groupId, label, children, ...rest } = props

            const optGroup = {
              groupId,
              groupTitle: label,
              children: [],
              rootProps: rest,
            } as CheckSelectDataGroupItem

            // @ts-ignore
            if (children) {
              // @ts-ignore
              optGroup.children = dfs(children)
            }

            arr.push(optGroup)
          }
        })

        return arr
      }

      return dfs(children)
    }

    return dataProp
  }, [children, dataProp])

  /**
   * 转换对象
   */
  const getKeyFields = useCallback(
    (node: any, key: string) => {
      return node[fieldNames[key] || key]
    },
    [fieldNames]
  )

  const flattedData = useMemo(() => {
    // @ts-ignore
    return flattenTree(data, (node) => {
      if ('groupId' in node.raw) {
        // @ts-ignore
        node.id = node.raw.groupId
        // @ts-ignore
        node.groupTitle = node.raw.groupTitle
        // @ts-ignore
        node.groupId = node.raw.groupId
      } else {
        // TODO：support children field map
        node.id = getKeyFields(node.raw, 'id')
        // @ts-ignore
        node.title = getKeyFields(node.raw, 'title')
        // @ts-ignore
        node.disabled = getKeyFields(node.raw, 'disabled') ?? false
      }
      return node
    })
  }, [data, getKeyFields])

  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChangeProp)

  const onSelectLatest = useLatestCallback(onSelect)

  const flattedDataRef = useLatestRef(flattedData)

  const proxyTryChangeValue = useCallback(
    (
      value: React.ReactText[],
      item: CheckSelectEventData | CheckSelectEventData[],
      shouldChecked: boolean
    ) => {
      // 调用用户的select
      const checkedItems = flattedDataRef.current
        // 使用最新的value
        .filter((item) => value.includes(item.id))
        .map((item) => item.raw)

      let changedItems = item as CheckSelectEventData[]

      if (!Array.isArray(item)) {
        changedItems = [item]

        onSelectLatest(value, item, shouldChecked)
      }

      tryChangeValue(
        value,
        // TODO: 处理脏数据
        changedItems.map((item) => ('raw' in item ? item.raw : item)),
        checkedItems
      )
    },
    // deps-ignore: isCheckedId no changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tryChangeValue, onSelectLatest, flattedDataRef]
  )

  const [onOptionCheck, isCheckedId] = useCheckDefault({
    disabled,
    checkedIds: value,
    onCheck: proxyTryChangeValue,
    allowCheck,
  })

  // const [inSearch, matchedItems, inputProps, isEmpty, resetSearch] = useSearch(data, filter)

  // const getSearchInputProps = useCallback(
  //   () => ({
  //     placeholder: searchPlaceholder,
  //     value: inputProps.value,
  //     onChange: inputProps.onChange,
  //   }),
  //   [searchPlaceholder, inputProps]
  // )

  return {
    rootProps: rest,
    // data: inSearch ? matchedItems : data,
    data,
    flattedData,
    value,
    tryChangeValue: proxyTryChangeValue,
    onSelect: onOptionCheck,
    isCheckedId,
    emptyContent,
    // getSearchInputProps,
    // isEmpty,
    // resetSearch,
  }
}

export interface UseCheckSelectProps {
  /**
   * 设置当前选中值
   */
  value?: React.ReactText[]
  /**
   * 设置当前选中值默认值
   */
  defaultValue?: React.ReactText[]
  /**
   * 选中值改变时的回调
   * value: 所有选中项的 id 集合
   * changedItems: 变更的选项集合
   * checkedItems：所有选中项的选项集合
   */
  onChange?: (
    value: React.ReactText[],
    changedItems?: CheckSelectDataItem[],
    checkedItems?: CheckSelectDataItem[]
  ) => void
  /**
   * 选中值时回调
   */
  onSelect?: (
    value: React.ReactText[],
    targetOption: CheckSelectEventData,
    shouldChecked: boolean
  ) => void
  /**
   * 是否禁止使用
   */
  disabled?: boolean
  /**
   * 设置选项为空时展示的内容
   */
  emptyContent?: React.ReactNode
  /**
   * 自定义选择后触发器所展示的内容，只在 title 为字符串时有效
   */
  displayRender?: (option: CheckSelectEventData) => React.ReactNode
  /**
   * 触发器输入框占位符
   */
  placeholder?: string
  /**
   * 搜索输入框占位符
   */
  searchPlaceholder?: string
  /**
   * 启用自定义过滤函数实现根据搜索框内容，自定义搜索
   */
  filter?: (keyword: string, option: CheckSelectEventData) => boolean
  /**
   * 选项数据
   */
  data?: CheckSelectDataItem[]
  /**
   * JSX 子节点
   */
  children?: React.ReactNode
  /**
   * 设置 data 中 id, title, disabled, children 对应的 key
   */
  fieldNames?: Record<string, string>
}

export type UseSelectReturn = ReturnType<typeof useCheckSelect>

const allowCheck = (option: any) => !option.disabled
