import React, { useState, useMemo, useCallback } from 'react'
import { useToggle } from '@hi-ui/use-toggle'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { CascaderItemEventData, FlattedCascaderItem, CascaderItemRequiredProps } from './types'
import {
  flattenTreeData,
  getNodeAncestors,
  getActiveMenus,
  getFlattedMenus,
  getActiveMenuList,
} from './utils'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useCache, useSearch, useSelect, useAsyncSwitch } from './hooks'

import { CascaderProps } from './Cascader'

export const useCascader = ({
  defaultValue = '',
  value: valueProp,
  onChange: onChangeProp,
  data,
  clearable = false,
  displayRender,
  searchPlaceholder,
  disabled = false,
  changeOnSelect = false,
  searchable = true,
  flatted: flattedProp = false,
  upMatch = false,
  expandTrigger = 'click',
  emptyContent = '无匹配选项',
  placeholder,
  onChange,
  titleRender,
  onLoadChildren,
  ...rest
}: UseCascaderProps) => {
  const [menuVisible, menuVisibleAction] = useToggle()
  const [targetElRef, setTargetElRef] = useState<HTMLElement | null>(null)

  const onChangeLatest = useLatestCallback(onChangeProp)

  const proxyOnSelect = useCallback(
    (selectedId: React.ReactText, selectOption: CascaderItemEventData) => {
      const optionPath = getNodeAncestors(selectOption)

      if (changeOnSelect) {
        // 任意选中
        onChangeLatest(selectedId, selectOption, optionPath)
      } else {
        // 选择末级
        const hasChildren = selectOption.children && selectOption.children.length > 0
        const canLoadChildren =
          hasChildren || (onLoadChildren && !selectOption.children && !selectOption.isLeaf)

        console.log(selectOption, canLoadChildren)

        if (canLoadChildren) {
          return
        }
        onChangeLatest(selectedId, selectOption, optionPath)
      }
      // 关闭弹窗
      menuVisibleAction.off()
    },
    [onChangeLatest, changeOnSelect, menuVisibleAction, onLoadChildren]
  )

  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, proxyOnSelect)
  const [cascaderData, setCascaderData] = useCache(data)

  const flattedData = useMemo(() => flattenTreeData(cascaderData), [cascaderData])

  // 单击选中某项
  const [selectedId, onOptionSelect] = useSelect(disabled, valueProp, tryChangeValue)

  // 选中 id 路径
  const selectedItems = useMemo(() => getActiveMenuList(flattedData, selectedId), [
    flattedData,
    selectedId,
  ])
  const selectedIds = selectedItems.map(({ id }) => id)

  // 存在异步加载数据的情况，单击选中时需要控制异步加载状态
  const [isLoadingId, onItemExpand] = useAsyncSwitch(
    setCascaderData,
    onOptionSelect,
    onLoadChildren
  )

  const onItemHover = useCallback(
    (option) => {
      onItemExpand(option)
    },
    [onItemExpand]
  )

  const [inSearch, matchedItems, inputProps, isEmpty] = useSearch(flattedData, upMatch)

  // 搜索的结果列表也采用 flatted 模式进行展示
  const flatted = flattedProp || inSearch
  const flattedCascaderData = inSearch ? matchedItems : flattedData

  const menuList = useMemo(() => {
    return flatted ? getFlattedMenus(flattedCascaderData) : getActiveMenus(flattedData, selectedId)
  }, [flatted, flattedCascaderData, flattedData, selectedId])

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

  const rootProps = {
    ...rest,
  }

  const getPopperProps = useCallback(
    () => ({
      visible: menuVisible,
      attachEl: targetElRef,
    }),
    [menuVisible, targetElRef]
  )

  const getTriggerProps = useCallback(
    () => ({
      ref: setTargetElRef,
      clearable,
      displayRender,
    }),
    [clearable, displayRender]
  )

  const getSearchInputProps = useCallback(
    () => ({
      placeholder: searchPlaceholder,
      value: inputProps.value,
      onChange: inputProps.onChange,
    }),
    [searchPlaceholder, inputProps]
  )

  return {
    rootProps,
    flattedData,
    selectedItems,
    value,
    tryChangeValue,
    getCascaderItemRequiredProps,
    expandTrigger,
    flatted,
    onItemClick: onItemExpand,
    onItemHover,
    changeOnSelect,
    onLoadChildren,
    disabled,
    menuList,
    searchable,
    isEmpty,
    placeholder,
    displayRender,
    clearable,
    titleRender,
    emptyContent,
    getTriggerProps,
    getPopperProps,
    getSearchInputProps,
  }
}

export interface UseCascaderProps extends CascaderProps {}

export type UseCascaderReturn = ReturnType<typeof useCascader>
