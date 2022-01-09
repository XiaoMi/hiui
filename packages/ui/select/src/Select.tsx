import React, { forwardRef, useCallback, useMemo, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { MockInput } from '@hi-ui/input'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { useSelect, UseSelectProps } from './use-select'
import type { HiBaseHTMLProps } from '@hi-ui/core'
import { DownOutlined, UpOutlined } from '@hi-ui/icons'
import { SelectProvider, useSelectContext } from './context'
import { SelectDataItem } from './types'
import { useLatestCallback, useLatestRef } from '@hi-ui/use-latest'
import VirtualList from 'rc-virtual-list'
import { times } from '@hi-ui/times'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'
import { Picker, PickerProps } from '@hi-ui/picker'
import { Highlighter } from '@hi-ui/highlighter'
import { UseDataSource } from '@hi-ui/use-data-source'
import {
  useAsyncSearch,
  useFilterSearch,
  useSearchMode,
  useTreeCustomSearch,
} from '@hi-ui/use-search-mode'
import { uniqBy } from 'lodash'
import { useData } from './hooks/use-data'

const _role = 'select'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Select
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

    // 搜索时临时缓存选中异步数据
    const [selectedItem, setSelectedItem] = useState<SelectDataItem | null>(null)

    const onSelectLatest = useLatestCallback(onSelectProp)
    const onSelect = useCallback(
      (value: React.ReactText, item: SelectDataItem) => {
        onSelectLatest(value, item)
        setSelectedItem(item)

        // 关闭弹窗
        menuVisibleAction.off()
      },
      [menuVisibleAction, onSelectLatest]
    )

    const data = useData({ data: dataProp, children, fieldNames })

    const { rootProps, ...context } = useSelect({ ...rest, onSelect, data })
    const { value, tryChangeValue, flattedData: selectData } = context

    // ************************** 异步搜索 ************************* //

    // TODO: 支持对 Item 传入 状态
    const { loading, hasError, ...dataSourceStrategy } = useAsyncSearch({ dataSource })
    const customSearchStrategy = useTreeCustomSearch({ data: selectData, filterOption })
    const filterSearchStrategy = useFilterSearch({
      data: selectData,
      flattedData: selectData,
      searchMode: searchableProp ? 'filter' : undefined,
    })

    const {
      state: stateInSearch,
      searchable,
      searchMode,
      onSearch,
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
        const highlight = !!searchValue && (searchMode === 'highlight' || searchMode === 'filter')

        const ret = highlight ? <Highlighter keyword={searchValue}>{node.title}</Highlighter> : true

        return ret
      },
      [titleRender, searchValue, searchMode]
    )

    const shouldUseSearch = !!searchValue && !hasError

    const selectProps = {
      data: shouldUseSearch ? stateInSearch.data : selectData,
      titleRender: proxyTitleRender,
    }

    // 下拉菜单不能合并（因为树形数据，不知道是第几级）
    const mergedData: any[] = useMemo(() => {
      if (selectedItem) {
        const nextData = [selectedItem].concat(selectData as any[])
        return uniqBy(nextData, 'id')
      }

      return selectData
    }, [selectedItem, selectData])

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
              displayRender={displayRenderProp}
              suffix={menuVisible ? <UpOutlined /> : <DownOutlined />}
              focused={menuVisible}
              value={value}
              onChange={tryChangeValue}
              // @ts-ignore
              data={mergedData.filter((item) => !('groupTitle' in item))}
              // @ts-ignore
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
                  <SelectOptionGroup label={node.groupTitle} />
                ) : (
                  // @ts-ignore
                  <SelectOption option={node} depth={node.depth} titleRender={proxyTitleRender} />
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
  titleRender?: (item: SelectDataItem) => React.ReactNode
  /**
   * 自定义选择后触发器所展示的内容，只在 title 为字符串时有效
   */
  displayRender?: (option: SelectDataItem) => React.ReactNode
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
   * 节点搜索模式，仅在mode=normal模式下生效
   */
  searchMode?: 'highlight' | 'filter'
  /**
   * 自定义搜索过滤器，仅在 searchable 为 true 时有效
   * 第一个参数为输入的关键字，
   * 第二个为数据项，返回值为 true 时将出现在结果项
   */
  filterOption?: (keyword: string, item: SelectDataItem) => boolean
  /**
   * 异步加载数据
   */
  dataSource?: UseDataSource<SelectDataItem>
}

// @ts-ignore
Select.HiName = 'Select'
if (__DEV__) {
  Select.displayName = 'Select'
}

const optionPrefix = getPrefixCls('select-option')

export const SelectOption = forwardRef<HTMLDivElement | null, SelectOptionProps>(
  (
    {
      prefixCls = optionPrefix,
      className,
      children,
      option = {},
      depth,
      onClick,
      titleRender,
      ...rest
    },
    ref
  ) => {
    const { isSelectedId, onSelect } = useSelectContext()

    const { id, disabled = false } = option
    const selected = isSelectedId(id)

    const eventNodeRef = useLatestRef(
      Object.assign({}, option, {
        disabled: disabled,
        selected,
      })
    )

    const cls = cx(
      prefixCls,
      className,
      selected && `${prefixCls}--selected`,
      disabled && `${prefixCls}--disabled`
    )

    const onClickLatest = useLatestCallback(onClick)
    const handleClick = useCallback(
      (evt) => {
        onSelect(eventNodeRef.current)
        onClickLatest(evt)
      },
      [onSelect, onClickLatest, eventNodeRef]
    )

    const renderTitle = useCallback(
      (node: any, titleRender?: (node: any) => React.ReactNode) => {
        // 如果 titleRender 返回 `true`，则使用默认 title
        const title = titleRender ? titleRender(node) : true

        return <div className={`${prefixCls}__title`}>{title === true ? node.title : title}</div>
      },
      [prefixCls]
    )

    return (
      <div ref={ref} className={cls} onClick={handleClick} {...rest}>
        {renderIndent(prefixCls, depth)}
        {renderTitle(eventNodeRef.current, titleRender)}
        {/* <span className={`${prefixCls}__title`}>{option.title}</span> */}
      </div>
    )
  }
)

export interface SelectOptionProps extends HiBaseHTMLProps {}
// @ts-ignore
SelectOption.HiName = 'SelectOption'

if (__DEV__) {
  SelectOption.displayName = 'SelectOption'
}

const optionGroupPrefix = getPrefixCls('select-option-group')

/**
 * TODO: What is SelectOptionGroup
 */
export const SelectOptionGroup = forwardRef<HTMLDivElement | null, SelectOptionGroupProps>(
  ({ prefixCls = optionGroupPrefix, className, children, label, onClick, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} className={cls} {...rest}>
        <span>{label}</span>
      </div>
    )
  }
)

export interface SelectOptionGroupProps extends HiBaseHTMLProps {}

// @ts-ignore
SelectOptionGroup.HiName = 'SelectOptionGroup'
if (__DEV__) {
  SelectOptionGroup.displayName = 'SelectOptionGroup'
}

/**
 * 渲染空白占位
 */
const renderIndent = (prefixCls: string, depth: number) => {
  return times(depth, (index: number) => {
    return (
      <span key={index} style={{ alignSelf: 'stretch' }}>
        <span className={cx(`${prefixCls}__indent`)} />
      </span>
    )
  })
}
