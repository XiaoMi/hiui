import React, { useMemo, useCallback } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { FlattedCascaderItem, CascaderItemRequiredProps, CascaderItemEventData } from './types'
import {
  flattenTreeData,
  getActiveMenus,
  getFlattedMenus,
  getActiveNodePaths,
  checkCanLoadChildren,
} from './utils'
import { useCache, useSearch, useSelect, useAsyncSwitch } from './hooks'

import { CascaderProps } from './Cascader'

const NOOP_ARRAY = [] as []
const NOOP_VALUE = ''

export const useCascader = ({
  defaultValue = NOOP_VALUE,
  value: valueProp,
  onChange: onChangeProp,
  data = NOOP_ARRAY,
  disabled = false,
  changeOnSelect = false,
  flatted: flattedProp = false,
  upMatch = false,
  expandTrigger = 'click',
  emptyContent = '无匹配选项',
  placeholder,
  searchPlaceholder,
  onSelect,
  titleRender,
  displayRender,
  onLoadChildren,
  ...rest
}: UseCascaderProps) => {
  const [cascaderData, setCascaderData] = useCache(data)

  const flattedData = useMemo(() => flattenTreeData(cascaderData), [cascaderData])

  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChangeProp)

  const proxyTryChangeValue = useCallback(
    (value: React.ReactText, item: CascaderItemEventData, itemPaths: FlattedCascaderItem[]) => {
      tryChangeValue(value, item, itemPaths)
      onSelect?.(value, item, itemPaths)
    },
    [tryChangeValue, onSelect]
  )

  // 单击选中某项
  const [selectedId, onOptionSelect, setSelectedId] = useSelect(
    disabled,
    proxyTryChangeValue,
    changeOnSelect,
    onLoadChildren
  )

  // 选中 id 路径
  const selectedIds = useMemo(
    () => getActiveNodePaths(flattedData, selectedId).map(({ id }) => id),
    [flattedData, selectedId]
  )

  // 存在异步加载数据的情况时，单击选中时需要控制异步加载状态
  const [isLoadingId, onItemExpand] = useAsyncSwitch(
    setCascaderData,
    onOptionSelect,
    onLoadChildren
  )

  const onItemHover = useCallback(
    (option) => {
      // hover模式，仅展开节点，不触发 change
      onItemExpand(option, true)
    },
    [onItemExpand]
  )

  const isCanLoadChildren = useCallback(
    (option) => {
      return checkCanLoadChildren(option, onLoadChildren)
    },
    [onLoadChildren]
  )

  const [inSearch, matchedItems, inputProps, isEmpty, resetSearch] = useSearch(
    flattedData,
    upMatch,
    isCanLoadChildren
  )

  const menuList = useMemo(() => {
    if (inSearch) {
      return [matchedItems]
    }
    return flattedProp
      ? getFlattedMenus(flattedData, isCanLoadChildren)
      : getActiveMenus(flattedData, selectedId)
  }, [inSearch, flattedProp, matchedItems, flattedData, selectedId, isCanLoadChildren])

  // 搜索的结果列表也采用 flatted 模式进行展示
  const flatted = flattedProp || inSearch

  const getCascaderItemRequiredProps = useCallback(
    ({ id, depth }: FlattedCascaderItem): CascaderItemRequiredProps => {
      return {
        selected: flatted ? selectedId === id : selectedIds[depth] === id,
        loading: isLoadingId(id),
        // TODO: 表示聚焦状态，添加快捷键时可以一起处理
        focused: false,
      }
    },
    [flatted, selectedId, selectedIds, isLoadingId]
  )

  const getSearchInputProps = useCallback(
    () => ({
      placeholder: searchPlaceholder,
      value: inputProps.value,
      onChange: inputProps.onChange,
    }),
    [searchPlaceholder, inputProps]
  )

  const reset = useCallback(() => {
    resetSearch()
    setSelectedId(value)
  }, [resetSearch, setSelectedId, value])

  return {
    rootProps: rest,
    reset,
    flattedData,
    value,
    tryChangeValue,
    getCascaderItemRequiredProps,
    expandTrigger,
    flatted,
    onItemClick: onItemExpand,
    onItemHover,
    changeOnSelect,
    onLoadChildren,
    keyword: inputProps.value,
    disabled,
    menuList,
    isEmpty,
    placeholder,
    displayRender,
    titleRender,
    emptyContent,
    getSearchInputProps,
  }
}

export interface UseCascaderProps extends CascaderProps {}

export type UseCascaderReturn = ReturnType<typeof useCascader>
