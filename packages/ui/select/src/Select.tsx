import React, { forwardRef, useCallback, useMemo, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { MockInput } from '@hi-ui/input'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { useSelect, UseSelectProps } from './use-select'
import { DownOutlined, UpOutlined } from '@hi-ui/icons'
import { SelectProvider } from './context'
import { FieldNames, FlattedSelectItem, SelectItemEventData, SelectMergedItem } from './types'
import { useLatestCallback } from '@hi-ui/use-latest'
import VirtualList from 'rc-virtual-list'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'
import { Picker, PickerProps } from '@hi-ui/picker'
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
import { uniqBy } from 'lodash'

const _role = 'select'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Select
 * TODO:
 * 1. 异步搜索的结果拍平展示
 * 2. 点击清空时元数据处理
 * 3. 快捷键状态focus支持
 *
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
      placeholder = '请选择',
      displayRender: displayRenderProp,
      // Virtual List
      height,
      itemHeight = 40,
      virtual = true,
      // search
      searchable: searchableProp,
      dataSource,
      filterOption,
      // popper
      onOpen,
      onClose,
      popper,
      // render
      renderExtraFooter,
      titleRender,
      data: dataProp,
      fieldNames,
      onSelect: onSelectProp,
      ...rest
    },
    ref
  ) => {
    const [menuVisible, menuVisibleAction] = useUncontrolledToggle({ disabled, onOpen, onClose })

    const onSelect = useLatestCallback((value: React.ReactText, item: SelectItemEventData) => {
      onSelectProp?.(value, item)

      setSelectedItems([item])
      // 关闭弹窗
      menuVisibleAction.off()
    })

    const data = useData({ data: dataProp, children, fieldNames })
    const flattedData = useFlattenData({ data, fieldNames })

    const { rootProps, ...context } = useSelect({ ...rest, onSelect })
    const { value, tryChangeValue, getSelectItemEventData } = context

    // 临时缓存选中异步数据
    const [selectedItems, setSelectedItems] = useState<FlattedSelectItem[]>([])

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
      strategies: [dataSourceStrategy, customSearchStrategy, filterSearchStrategy],
    })

    // 拦截 titleRender，自定义高亮展示
    const proxyTitleRender = useCallback(
      (node: any) => {
        if (titleRender) {
          const ret = titleRender(node)
          if (ret && ret !== true) return ret
        }

        // 本地搜索执行默认高亮规则
        const highlight = inSearch && searchMode === 'filter'

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

    const selectProps = {
      data: shouldUseSearch ? flattedDataAsync : flattedData,
      titleRender: proxyTitleRender,
    }

    const mergedData = useMemo(() => {
      let nextData = flattedData as FlattedSelectItem[]

      if (selectedItems) {
        nextData = selectedItems.concat(flattedData as any[])
        nextData = uniqBy(nextData, 'id')
      }

      return nextData.filter((item) => !('groupTitle' in item))
    }, [selectedItems, flattedData])

    const cls = cx(prefixCls, className)

    return (
      <SelectProvider value={context}>
        <Picker
          ref={ref}
          className={cls}
          {...rootProps}
          visible={menuVisible}
          disabled={disabled}
          onOpen={menuVisibleAction.on}
          onClose={menuVisibleAction.off}
          searchable={searchable}
          onSearch={onSearch}
          loading={loading}
          footer={renderExtraFooter ? renderExtraFooter() : null}
          trigger={
            <MockInput
              clearable={clearable}
              placeholder={placeholder}
              displayRender={displayRenderProp as any}
              suffix={menuVisible ? <UpOutlined /> : <DownOutlined />}
              focused={menuVisible}
              value={value}
              onChange={(value, item) => {
                tryChangeValue(value, getSelectItemEventData(item))
              }}
              data={mergedData}
              invalid={invalid}
              appearance={appearance}
            />
          }
        >
          {isArrayNonEmpty(selectProps.data) ? (
            <VirtualList
              itemKey="id"
              fullHeight={false}
              height={height}
              itemHeight={itemHeight}
              virtual={virtual}
              data={selectProps.data}
            >
              {(node: any) => {
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
  extends Omit<PickerProps, 'data' | 'onChange' | 'trigger'>,
    UseSelectProps {
  /**
   * 选项数据
   */
  data?: SelectMergedItem[]
  /**
   * 设置 data 中 id, title, disabled, children 对应的 key
   */
  fieldNames?: FieldNames
  /**
   * 设置展现形式
   */
  appearance?: 'outline' | 'unset' | 'filled'
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
  titleRender?: (item: SelectItemEventData) => React.ReactNode
  /**
   * 自定义选择后触发器所展示的内容，只在 title 为字符串时有效
   */
  displayRender?: (option: SelectItemEventData) => React.ReactNode
  /**
   * 自定义下拉菜单底部渲染
   */
  renderExtraFooter?: () => React.ReactNode
  /**
   * 设置虚拟滚动容器的可视高度
   */
  height?: number
  /**
   * 设置虚拟列表每项的固定高度
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
   * 自定义搜索过滤器，仅在 searchable 为 true 时有效
   * 第一个参数为输入的关键字，
   * 第二个为数据项，返回值为 true 时将出现在结果项
   */
  filterOption?: (keyword: string, item: SelectItemEventData) => boolean
  /**
   * 异步加载数据
   */
  dataSource?: UseDataSource<SelectItemEventData>
}

;(Select as any).HiName = 'Select'
if (__DEV__) {
  Select.displayName = 'Select'
}
