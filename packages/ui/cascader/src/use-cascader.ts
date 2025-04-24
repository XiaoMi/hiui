import React, { useMemo, useCallback } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useCache } from '@hi-ui/use-cache'
import {
  FlattedCascaderDataItem,
  CascaderItemRequiredProps,
  CascaderItemEventData,
  CascaderDataItem,
} from './types'
import {
  flattenTreeData,
  getActiveMenus,
  getFlattedMenus,
  getActiveNodePaths,
  checkCanLoadChildren,
} from './utils'
import { useSelect, useAsyncSwitch } from './hooks'

const NOOP_ARRAY = [] as []
const NOOP_VALUE = [] as []

export const useCascader = ({
  defaultValue = NOOP_VALUE,
  value: valueProp,
  onChange: onChangeProp,
  data = NOOP_ARRAY,
  disabled = false,
  changeOnSelect = false,
  flatted = false,
  onSelect: onSelectProp,
  onLoadChildren,
  // @ts-ignore
  cascaderData: cascaderDataProp,
  // @ts-ignore
  setCascaderData: setCascaderDataProp,
  // @ts-ignore
  flattedData: flattedDataProp,
  fieldNames,
  ...rest
}: UseCascaderProps) => {
  const [cacheData, setCacheData] = useCache(data)
  const cascaderData = cascaderDataProp ?? cacheData
  const setCascaderData = setCascaderDataProp ?? setCacheData

  const flattedData = useMemo(() => flattedDataProp ?? flattenTreeData(cascaderData, fieldNames), [
    cascaderData,
    flattedDataProp,
    fieldNames,
  ])

  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChangeProp)

  const onSelect = (
    value: React.ReactText,
    item: CascaderItemEventData,
    itemPaths: FlattedCascaderDataItem[]
  ) => {
    tryChangeValue(itemPaths.map(({ id }) => id))
    onSelectProp?.(value, item, itemPaths)
  }

  // 单击选中某项
  const [selectedId, onOptionSelect, setSelectedId] = useSelect(
    disabled,
    onSelect,
    changeOnSelect,
    onLoadChildren,
    value?.[value.length - 1]
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

  const menuList = useMemo(() => {
    return flatted
      ? getFlattedMenus(flattedData, isCanLoadChildren)
      : getActiveMenus(flattedData, selectedId)
  }, [flatted, flattedData, selectedId, isCanLoadChildren])

  const getItemRequiredProps = useCallback(
    ({ id, depth }: FlattedCascaderDataItem): CascaderItemRequiredProps => {
      return {
        active: value[depth] === id,
        selected: flatted ? selectedId === id : selectedIds[depth] === id,
        loading: isLoadingId(id),
        // TODO: 表示聚焦状态，添加快捷键时可以一起处理
        focused: false,
      }
    },
    [flatted, selectedId, selectedIds, isLoadingId, value]
  )

  const reset = useCallback(() => {
    setSelectedId(value[value.length - 1])
  }, [setSelectedId, value])

  return {
    rootProps: rest,
    reset,
    flattedData,
    value,
    tryChangeValue,
    getItemRequiredProps,
    flatted,
    onItemClick: onItemExpand,
    onItemHover,
    changeOnSelect,
    onLoadChildren,
    disabled,
    menuList,
  }
}

export interface UseCascaderProps {
  /**
   * 设置 data 中 id, title, disabled, children 对应的 key
   */
  fieldNames?: Record<string, string>
  /**
   * 设置选择项数据源
   */
  data?: CascaderDataItem[]
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
    value: React.ReactText[]
    // @API：暂时不对外
    // targetOption?: CascaderItemEventData,
    // optionPaths?: FlattedCascaderDataItem[]
  ) => void
  /**
   * 选中选项时触发，仅供内部使用。暂不对外暴露
   * @private
   */
  onSelect?: (
    value: React.ReactText,
    targetOption: CascaderItemEventData,
    optionPaths: FlattedCascaderDataItem[]
  ) => void
  /**
   * 是否禁止使用
   */
  disabled?: boolean
  /**
   * 是否启用选择即改变功能
   */
  changeOnSelect?: boolean
  /**
   * 是否启用选择即关闭（用于 changeOnSelect 模式下控制父节点点击交互）
   * @default true
   */
  closeOnSelect?: boolean
  /**
   * 将选项拍平展示，不支持 `onLoadChildren` 异步加载交互。暂不对外暴露
   * @private
   */
  flatted?: boolean
  /**
   * 异步请求更新数据
   */
  onLoadChildren?: (
    item: CascaderItemEventData,
    idPaths: React.ReactText[]
  ) => Promise<CascaderDataItem[] | void> | void
}

export type UseCascaderReturn = ReturnType<typeof useCascader>
