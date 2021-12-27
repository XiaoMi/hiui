import React, { useCallback, useMemo } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useSearch } from './hooks'
import { useCheck as useCheckDefault } from '@hi-ui/use-check'
import { CheckSelectOptionItem, CheckSelectOptionOrOptionGroupItem } from './types'
import { useLatestCallback } from '@hi-ui/use-latest'
import { toArray } from '@hi-ui/use-children'

const NOOP_ARRAY = [] as []
const NOOP_VALUE = [] as []

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
  titleRender,
  ...rest
}: UseSelectProps) => {
  const data = useMemo(() => {
    if (children) {
      const arr: any[] = []

      const dfs = (child: any) => {
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
            }
            arr.push(option)
            // @ts-ignore
          } else if (item.type.HiName === 'CheckSelectOptionGroup') {
            const { props } = item as any
            const { label, children, ...rest } = props

            const optGroup = {
              groupTitle: label,
              children: [],
              rootProps: rest,
            }

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

  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChangeProp)

  const onSelectLatest = useLatestCallback(onSelect)

  const proxyTryChangeValue = useCallback(
    (value: React.ReactText[], item: CheckSelectOptionItem, shouldChecked: boolean) => {
      tryChangeValue(value, item, shouldChecked)
      onSelectLatest(value, item, shouldChecked)
    },
    [tryChangeValue, onSelectLatest]
  )

  const [onOptionCheck, isSelectedId] = useCheckDefault({
    disabled,
    checkedIds: value,
    onCheck: proxyTryChangeValue,
    allowCheck,
  })

  const [inSearch, matchedItems, inputProps, isEmpty, resetSearch] = useSearch(data, filter)

  const getSearchInputProps = useCallback(
    () => ({
      placeholder: searchPlaceholder,
      value: inputProps.value,
      onChange: inputProps.onChange,
    }),
    [searchPlaceholder, inputProps]
  )

  return {
    rootProps: rest,
    data: inSearch ? matchedItems : data,
    value,
    onSelect: onOptionCheck,
    isSelectedId,
    emptyContent,
    getSearchInputProps,
    tryChangeValue,
    isEmpty,
    resetSearch,
    titleRender,
  }
}

export interface UseSelectProps {
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
   */
  onChange?: (
    value: React.ReactText[],
    targetOption?: CheckSelectOptionItem,
    shouldChecked?: boolean
  ) => void
  /**
   * 选中值时回调
   */
  onSelect?: (
    value: React.ReactText[],
    targetOption?: CheckSelectOptionItem,
    shouldChecked?: boolean
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
   * 自定义渲染节点的 title 内容
   */
  titleRender?: (item: CheckSelectOptionItem) => React.ReactNode
  /**
   * 自定义选择后触发器所展示的内容，只在 title 为字符串时有效
   */
  displayRender?: (option: CheckSelectOptionItem) => React.ReactNode
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
  filter?: (keyword: string, option: CheckSelectOptionOrOptionGroupItem) => boolean
  /**
   * 选项数据
   */
  data?: CheckSelectOptionItem[]
  /**
   * JSX 子节点
   */
  children?: React.ReactNode
}

export type UseSelectReturn = ReturnType<typeof useCheckSelect>

const allowCheck = (option: any) => !option.disabled
