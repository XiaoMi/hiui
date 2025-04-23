import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { MockInput } from '@hi-ui/input'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { useSelect, UseSelectProps } from './use-select'
import { DownOutlined, UpOutlined } from '@hi-ui/icons'
import { SelectProvider } from './context'
import {
  FlattedSelectDataItem,
  SelectDataItem,
  SelectItemEventData,
  SelectMergedItem,
} from './types'
import { useLatestCallback } from '@hi-ui/use-latest'
import VirtualList, { useCheckInVirtual } from '@hi-ui/virtual-list'
import type { ListRef } from 'rc-virtual-list'
import { isArrayNonEmpty, isUndef } from '@hi-ui/type-assertion'
import { Picker, PickerProps, PickerHelper } from '@hi-ui/picker'
import { Highlighter } from '@hi-ui/highlighter'
import { UseDataSource } from '@hi-ui/use-data-source'
import {
  useAsyncSearch,
  useSearchMode,
  useTreeCustomSearch,
  useNormalFilterSearch,
} from '@hi-ui/use-search-mode'
import { useData, useFlattenData } from './hooks'
import { SelectOption } from './SelectOption'
import { SelectOptionGroup } from './SelectOptionGroup'
import { uniqBy } from '@hi-ui/array-utils'
import { HiBaseAppearanceEnum, HiBaseSizeEnum, useLocaleContext } from '@hi-ui/core'
import { callAllFuncs } from '@hi-ui/func-utils'
import { mockDefaultHandlers } from '@hi-ui/dom-utils'

const _role = 'select'
const _prefix = getPrefixCls(_role)

/**
 * 选择器
 */
export const Select = forwardRef<HTMLDivElement | null, SelectProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      appearance,
      invalid = false,
      disabled = false,
      // picker
      clearable = true,
      placeholder: placeholderProp,
      displayRender: displayRenderProp,
      // Virtual List
      height,
      itemHeight = 40,
      virtual = true,
      // search
      searchable: searchableProp,
      keyword: keywordProp,
      dataSource,
      searchOnInit,
      filterOption,
      // popper
      visible,
      onOpen,
      onClose,
      // render
      renderExtraFooter,
      render: titleRender,
      data: dataProp,
      fieldNames,
      size = 'md',
      prefix,
      suffix,
      onSelect: onSelectProp,
      onSearch: onSearchProp,
      onKeyDown: onKeyDownProp,
      onClear: onClearProp,
      customRender,
      ...rest
    },
    ref
  ) => {
    const i18n = useLocaleContext()
    const innerRef = useRef<PickerHelper>(null)
    const placeholder = isUndef(placeholderProp) ? i18n.get('select.placeholder') : placeholderProp

    const [menuVisible, menuVisibleAction] = useUncontrolledToggle({
      visible,
      disabled,
      onOpen,
      onClose,
    })

    const onSelect = useLatestCallback((value: React.ReactText, item: SelectItemEventData) => {
      onSelectProp?.(value, item)

      setSelectedItems([item])
      // 关闭弹窗
      menuVisibleAction.off()
    })

    const data = useData({ data: dataProp, children, fieldNames })
    const flattedData = useFlattenData({ data, fieldNames })

    const { rootProps, ...context } = useSelect({ ...rest, onSelect })
    const { value, tryChangeValue, getSelectItemEventData, onSelect: handleSelect } = context

    // 临时缓存选中异步数据
    const [selectedItems, setSelectedItems] = useState<FlattedSelectDataItem[]>([])

    // ************************** 异步搜索 ************************* //

    // TODO: 支持对 Item 传入 状态
    const { loading, hasError, ...dataSourceStrategy } = useAsyncSearch({ dataSource })
    const customSearchStrategy = useTreeCustomSearch({ data: flattedData, filterOption })
    const filterSearchStrategy = useNormalFilterSearch({
      enabled: searchableProp,
      data: flattedData,
    })

    const {
      state: stateInSearch,
      searchable,
      searchMode,
      onSearch,
      inSearch,
      keyword: searchValue,
    } = useSearchMode({
      searchable: searchableProp,
      keyword: keywordProp,
      strategies: [dataSourceStrategy, customSearchStrategy, filterSearchStrategy],
      searchOnInit,
    })

    // 拦截 titleRender，自定义高亮展示
    const proxyTitleRender = useCallback(
      (node: any) => {
        if (titleRender) {
          const ret = titleRender(node)
          if (ret && ret !== true) return ret
        }

        // 本地搜索执行默认高亮规则
        const highlight = inSearch && (searchMode === 'filter' || searchMode === 'dataSource')

        const ret = highlight ? <Highlighter keyword={searchValue}>{node.title}</Highlighter> : true

        return ret
      },
      [titleRender, inSearch, searchValue, searchMode]
    )

    const shouldUseSearch = inSearch && !hasError

    // 异步搜索数据特殊处理，扁平化
    const flattedDataAsync = useFlattenData({
      data: shouldUseSearch && searchMode === 'dataSource' ? stateInSearch.data : undefined,
      fieldNames,
    })

    const showData = useMemo(() => {
      if (shouldUseSearch) {
        if (searchMode === 'dataSource') {
          return flattedDataAsync
        }
        return stateInSearch.data
      }

      return flattedData
    }, [shouldUseSearch, searchMode, flattedData, flattedDataAsync, stateInSearch.data])

    const mergedData = useMemo(() => {
      let nextData = flattedData as FlattedSelectDataItem[]

      if (selectedItems) {
        nextData = selectedItems.concat(flattedData as any[])
        nextData = uniqBy(nextData, 'id')
      }

      return nextData.filter((item) => !('groupTitle' in item))
    }, [selectedItems, flattedData])

    // ************************** 回车选中处理 ************************* //

    const defaultIndex = showData.findIndex((item: SelectDataItem) => !item.disabled)

    const [focusedIndex, setFocusedIndex] = useState<number>(defaultIndex)

    const handleKeyDown = useLatestCallback((evt: React.KeyboardEvent) => {
      const { keyCode } = evt

      if (keyCode === 13) {
        const item = showData[focusedIndex]

        if (item) {
          handleSelect(item)
        }
      }
    })

    // 更新 focused 索引
    useEffect(() => {
      const index = showData.findIndex((item: SelectDataItem) => item.id === value)
      setFocusedIndex(index !== -1 ? index : defaultIndex)
    }, [showData, value, menuVisible, defaultIndex])

    const cls = cx(prefixCls, className)

    const virtualListProps = {
      height: height,
      itemHeight: itemHeight,
      virtual: virtual,
      data: showData,
    }
    const { inVirtual } = useCheckInVirtual(virtualListProps)

    const listRef = useRef<ListRef>(null)

    useEffect(() => {
      // 每次打开或数据改变时触发一次滚动条显示
      if (menuVisible && isArrayNonEmpty(showData)) {
        listRef.current?.scrollTo(undefined as any)
      }
    }, [menuVisible, showData])

    return (
      <SelectProvider value={context}>
        <Picker
          ref={ref}
          innerRef={innerRef}
          className={cls}
          {...rootProps}
          visible={menuVisible}
          disabled={disabled}
          onKeyDown={mockDefaultHandlers(handleKeyDown, onKeyDownProp)}
          onOpen={menuVisibleAction.on}
          onClose={menuVisibleAction.off}
          searchable={searchable}
          keyword={keywordProp}
          onSearch={callAllFuncs(onSearchProp, onSearch)}
          loading={rest.loading !== undefined ? rest.loading : loading}
          footer={renderExtraFooter ? renderExtraFooter() : null}
          scrollable={!inVirtual}
          trigger={
            customRender ? (
              typeof customRender === 'function' ? (
                customRender(
                  mergedData.find((d: SelectDataItem) => d.id === value) as SelectItemEventData
                )
              ) : (
                customRender
              )
            ) : (
              <MockInput
                clearable={clearable}
                placeholder={placeholder}
                displayRender={
                  displayRenderProp
                    ? (item: any) => {
                        return displayRenderProp(getSelectItemEventData(item))
                      }
                    : undefined
                }
                prefix={prefix}
                suffix={[menuVisible ? <UpOutlined /> : <DownOutlined />, suffix]}
                focused={menuVisible}
                value={value}
                onChange={(value, item) => {
                  tryChangeValue(value, item.raw)
                  // 非受控模式下清空下拉框
                  if (value === '') {
                    innerRef.current?.resetSearch()
                    onClearProp?.()
                  }
                }}
                size={size}
                data={mergedData}
                invalid={invalid}
                appearance={appearance}
              />
            )
          }
        >
          {isArrayNonEmpty(showData) ? (
            <VirtualList ref={listRef} itemKey="id" fullHeight={false} {...virtualListProps}>
              {(node: any, index) => {
                /* 反向 map，搜索删选数据时会对数据进行处理 */
                return 'groupTitle' in node ? (
                  <SelectOptionGroup
                    prefixCls={`${prefixCls}-option-group`}
                    label={node.groupTitle}
                    {...node.raw.rootProps}
                  />
                ) : (
                  <SelectOption
                    prefixCls={`${prefixCls}-option`}
                    onMouseEnter={() => {
                      !node.disabled && setFocusedIndex(index)
                    }}
                    focused={focusedIndex === index}
                    option={node}
                    depth={node.depth}
                    titleRender={proxyTitleRender}
                    {...node.raw.rootProps}
                  />
                )
              }}
            </VirtualList>
          ) : null}
        </Picker>
      </SelectProvider>
    )
  }
)

export interface SelectProps
  extends Omit<PickerProps, 'data' | 'onChange' | 'trigger' | 'scrollable'>,
    UseSelectProps {
  /**
   * 选项数据
   */
  data?: SelectMergedItem[]
  /**
   * 设置 data 中 id, title, disabled, children 对应的 key
   */
  fieldNames?: Record<string, string>
  /**
   * 设置展现形式
   */
  appearance?: HiBaseAppearanceEnum
  /**
   * 触发器输入框占位符
   */
  placeholder?: string
  /**
   * 是否可清空
   */
  clearable?: boolean
  /**
   * 自定义渲染节点的 title 内容
   */
  render?: (item: SelectItemEventData) => React.ReactNode
  /**
   * 自定义选择后触发器所展示的内容，只在 title 为字符串时有效
   */
  displayRender?: (option: SelectItemEventData) => React.ReactNode
  /**
   * 自定义下拉菜单底部渲染
   */
  renderExtraFooter?: () => React.ReactNode
  /**
   * 设置虚拟滚动容器的可视高度。暂不对外暴露
   * @private
   */
  height?: number
  /**
   * 设置虚拟列表每项的固定高度。暂不对外暴露
   * @private
   */
  itemHeight?: number
  /**
   * 	设置 `true` 开启虚拟滚动
   */
  virtual?: boolean
  /**
   * 是否可搜索（仅在 title 为字符串时支持）
   */
  searchable?: boolean
  /**
   * 搜索关键字，searchable 为 true 时有效
   */
  keyword?: string
  /**
   * 自定义搜索过滤器，仅在 searchable 为 true 时有效
   * 第一个参数为输入的关键字，
   * 第二个为数据项，返回值为 true 时将出现在结果项
   */
  filterOption?: (keyword: string, item: SelectItemEventData) => boolean
  /**
   * 异步加载数据
   */
  dataSource?: UseDataSource<SelectMergedItem[]>
  /**
   * 初始化时执行一次搜索，仅在 dataSource 不为空时有效
   */
  searchOnInit?: boolean
  /**
   * 搜索时触发
   */
  onSearch?: (keyword: string) => void
  /**
   * 点击关闭按钮时触发
   */
  onClear?: () => void
  /**
   * 设置大小
   */
  size?: HiBaseSizeEnum
  /**
   * 选择框前置内容
   */
  prefix?: React.ReactNode
  /**
   * 选择框后置内容
   */
  suffix?: React.ReactNode
  /**
   * 自定义触发器
   */
  customRender?: React.ReactNode | ((option: SelectItemEventData) => React.ReactNode)
}

;(Select as any).HiName = 'Select'
if (__DEV__) {
  Select.displayName = 'Select'
}
