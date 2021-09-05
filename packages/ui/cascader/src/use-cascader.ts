import { useMemo, useCallback } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { FlattedCascaderItem, CascaderItemRequiredProps } from './types'
import { flattenTreeData, getActiveMenus, getFlattedMenus, getActiveMenuList } from './utils'
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
  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChangeProp)

  const [cascaderData, setCascaderData] = useCache(data)

  const flattedData = useMemo(() => flattenTreeData(cascaderData), [cascaderData])

  // 单击选中某项
  const [selectedId, onOptionSelect] = useSelect(
    disabled,
    tryChangeValue,
    changeOnSelect,
    onLoadChildren,
    onSelect
  )

  // 选中 id 路径
  const selectedItems = useMemo(() => getActiveMenuList(flattedData, selectedId), [
    flattedData,
    selectedId,
  ])

  const selectedIds = selectedItems.map(({ id }) => id)

  console.log('selectedId', selectedId, selectedItems)

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
