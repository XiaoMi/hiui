import React, { forwardRef, useCallback, useMemo, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useCheckSelect, UseCheckSelectProps } from './use-check-select'
import type { HiBaseAppearanceEnum, HiBaseHTMLProps } from '@hi-ui/core'
import { DownOutlined, UpOutlined } from '@hi-ui/icons'
import { CheckSelectProvider, useCheckSelectContext } from './context'
import { CheckSelectDataItem, CheckSelectEventData, CheckSelectMergedItem } from './types'
import { useLatestCallback, useLatestRef } from '@hi-ui/use-latest'
import Checkbox from '@hi-ui/checkbox'
import { TagInputMock } from '@hi-ui/tag-input'
import { isFunction, isArrayNonEmpty, isUndef } from '@hi-ui/type-assertion'
import VirtualList from 'rc-virtual-list'
import { Picker, PickerProps } from '@hi-ui/picker'

import { uniqBy } from 'lodash'
import { Highlighter } from '@hi-ui/highlighter'
import { useToggle } from '@hi-ui/use-toggle'
import { UseDataSource } from '@hi-ui/use-data-source'
import { times } from '@hi-ui/times'
import { callAllFuncs } from '@hi-ui/func-utils'
import { useLocaleContext } from '@hi-ui/locale-context'

import {
  useAsyncSearch,
  useFilterSearch,
  useSearchMode,
  useTreeCustomSearch,
} from '@hi-ui/use-search-mode'
import { flattenData } from './hooks'

const _role = 'check-select'
const _prefix = getPrefixCls(_role)

const DEFAULT_FIELD_NAMES = {} as any

/**
 * TODO: What is CheckSelect
 */
export const CheckSelect = forwardRef<HTMLDivElement | null, CheckSelectProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      disabled = false,
      clearable = true,
      wrap = true,
      showCheckAll = false,
      showOnlyShowChecked = false,
      placeholder: placeholderProp,
      displayRender: displayRenderProp,
      onSelect: onSelectProp,
      height,
      itemHeight = 40,
      virtual = true,
      onOpen,
      onClose,
      // picker
      appearance,
      invalid,
      // search
      dataSource,
      filterOption,
      searchable: searchableProp,
      render: titleRender,
      renderExtraFooter,
      onSearch: onSearchProp,
      fieldNames = DEFAULT_FIELD_NAMES,
      ...rest
    },
    ref
  ) => {
    // ************************** 国际化 ************************* //

    const i18n = useLocaleContext()

    const placeholder = isUndef(placeholderProp)
      ? i18n.get('checkSelect.placeholder')
      : placeholderProp

    // ************************** Picker ************************* //

    const [menuVisible, menuVisibleAction] = useToggle()

    const displayRender = useCallback(
      (item: CheckSelectEventData) => {
        if (isFunction(displayRenderProp)) {
          return displayRenderProp(item)
        }
        return item.title
      },
      [displayRenderProp]
    )

    // 搜索时临时选中缓存数据
    const [selectedItems, setSelectedItems] = useState<CheckSelectDataItem[]>([])

    const onSelect = useLatestCallback(
      (value: React.ReactText[], item: CheckSelectEventData, shouldChecked: boolean) => {
        onSelectProp?.(value, item, shouldChecked)

        if (shouldChecked) {
          // TODO：as useCheckList
          setSelectedItems((prev) => {
            return [...prev, item]
          })
        }
      }
    )

    const { rootProps, ...context } = useCheckSelect({
      ...rest,
      children,
      fieldNames,
      onSelect,
    })

    const { value, tryChangeValue, flattedData } = context

    // ************************** 搜索 ************************* //

    const { loading, hasError, ...dataSourceStrategy } = useAsyncSearch({
      dataSource,
      dataTransform: (data: CheckSelectMergedItem) => flattenData({ data, fieldNames }),
    })

    const customSearchStrategy = useTreeCustomSearch({ data: flattedData, filterOption })
    const filterSearchStrategy = useFilterSearch({
      data: flattedData,
      flattedData: flattedData,
      enabled: searchableProp,
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
      (node: CheckSelectEventData) => {
        if (titleRender) {
          const ret = titleRender(node)
          if (ret && ret !== true) return ret
        }

        // 本地搜索执行默认高亮规则
        const highlight = !!searchValue && searchMode === 'filter'

        const ret = highlight ? (
          <Checkbox checked={node.checked} disabled={node.disabled}>
            <Highlighter keyword={searchValue}>{node.title}</Highlighter>
          </Checkbox>
        ) : (
          true
        )

        return ret
      },
      [titleRender, searchValue, searchMode]
    )

    const shouldUseSearch = !!searchValue && !hasError
    const showData = useMemo(() => {
      return shouldUseSearch ? stateInSearch.data : flattedData
    }, [shouldUseSearch, flattedData, stateInSearch.data])

    // 下拉菜单不能合并（因为树形数据，不知道是第几级）
    const mergedData: any[] = useMemo(() => {
      const nextData = selectedItems.concat(flattedData as any[])
      return uniqBy(nextData, 'id')
    }, [selectedItems, flattedData])

    const [filterItems, setFilterItems] = useState<any[] | null>(null)
    const dropdownItems = filterItems || showData

    const [allChecked, indeterminate] = useMemo(() => {
      const dropdownIds = dropdownItems
        .filter((item: any) => !('groupTitle' in item))
        .map(({ id }: any) => id)
      const dropdownIdsSet = new Set(dropdownIds)

      let hasValue = false

      value.forEach((id) => {
        if (dropdownIdsSet.has(id)) {
          hasValue = true
          dropdownIdsSet.delete(id)
        }
      })

      return [hasValue && dropdownIdsSet.size === 0, hasValue && dropdownIdsSet.size > 0]
    }, [dropdownItems, value])

    const toggleCheckAll = useCallback(
      (showChecked: boolean) => {
        const checkedItems = mergedData.filter((item) => {
          return value.includes(item.id)
        })

        const items = dropdownItems.filter((item: any) => !('groupTitle' in item))

        if (showChecked) {
          tryChangeValue(
            items.map(({ id }: any) => id),
            checkedItems,
            showChecked
          )
        } else {
          tryChangeValue([], checkedItems, showChecked)
        }
      },
      [dropdownItems, mergedData, value, tryChangeValue]
    )

    const renderDefaultFooter = () => {
      const extra = renderExtraFooter ? renderExtraFooter() : null
      if (showCheckAll) {
        return (
          <>
            <Checkbox
              indeterminate={indeterminate}
              checked={allChecked}
              onChange={(evt) => {
                toggleCheckAll(evt.target.checked)
              }}
            >
              {i18n.get('checkSelect.checkAll')}
            </Checkbox>
            {extra}
          </>
        )
      }
      return extra
    }

    const cls = cx(prefixCls, className, `${prefixCls}--${menuVisible ? 'open' : 'closed'}`)

    return (
      <CheckSelectProvider value={context}>
        <Picker
          ref={ref}
          className={cls}
          {...rest}
          visible={menuVisible}
          onOpen={() => {
            if (showOnlyShowChecked) {
              if (filterItems) {
                setFilterItems(null)
              }
            }
            menuVisibleAction.on()
          }}
          disabled={disabled}
          onClose={menuVisibleAction.off}
          searchable={searchable}
          onSearch={callAllFuncs(onSearchProp, onSearch)}
          loading={loading}
          footer={renderDefaultFooter()}
          trigger={
            <TagInputMock
              clearable={clearable}
              placeholder={placeholder}
              // @ts-ignore
              displayRender={displayRender}
              suffix={menuVisible ? <UpOutlined /> : <DownOutlined />}
              focused={menuVisible}
              appearance={appearance}
              value={value}
              // @ts-ignore
              onChange={tryChangeValue}
              data={mergedData}
              invalid={invalid}
              onExpand={() => {
                if (showOnlyShowChecked) {
                  setFilterItems(() => {
                    return mergedData.filter((item) => {
                      return value.includes(item.id)
                    })
                  })
                }

                menuVisibleAction.on()
              }}
            />
          }
        >
          {isArrayNonEmpty(dropdownItems) ? (
            <VirtualList
              itemKey="id"
              fullHeight={false}
              height={height}
              itemHeight={itemHeight}
              virtual={virtual}
              data={dropdownItems}
            >
              {(node: any) => {
                /* 反向 map，搜索删选数据时会对数据进行处理 */
                return 'groupTitle' in node ? (
                  <CheckSelectOptionGroup label={node.groupTitle} />
                ) : (
                  <CheckSelectOption
                    option={node}
                    depth={node.depth}
                    titleRender={proxyTitleRender}
                  />
                )
              }}
            </VirtualList>
          ) : null}
        </Picker>
      </CheckSelectProvider>
    )
  }
)

export interface CheckSelectProps extends Omit<PickerProps, 'trigger'>, UseCheckSelectProps {
  /**
   * 设置虚拟滚动容器的可视高度
   * @private
   */
  height?: number
  /**
   * 设置虚拟列表每项的固定高度
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
   * 是否可清空
   */
  clearable?: boolean
  /**
   * 是否开启换行全展示
   */
  wrap?: boolean
  /**
   * 是否点击清理 tags
   */
  onClear?: () => void
  /**
   * 自定义尺寸
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 自定义渲染节点的 title 内容
   */
  render?: (item: CheckSelectEventData) => React.ReactNode
  /**
   * 自定义选择后触发器所展示的内容，只在 title 为字符串时有效
   */
  displayRender?: (option: CheckSelectEventData) => React.ReactNode
  /**
   * 触发器输入框占位符
   */
  placeholder?: string
  /**
   * 设置展现形式
   */
  appearance?: HiBaseAppearanceEnum
  /**
   * 节点搜索模式，仅在mode=normal模式下生效
   */
  searchMode?: 'highlight' | 'filter'
  /**
   * 自定义搜索过滤器，仅在 searchable 为 true 时有效
   * 第一个参数为输入的关键字，
   * 第二个为数据项，返回值为 true 时将出现在结果项
   */
  filterOption?: (keyword: string, item: CheckSelectDataItem) => boolean
  /**
   * 异步加载数据
   */
  dataSource?: UseDataSource<CheckSelectDataItem>
  /**
   * 自定义下拉菜单底部渲染
   */
  renderExtraFooter?: () => React.ReactNode
  /**
   * 自定义 input 后缀 icon
   */
  suffixIcon?: React.ReactNode
  /**
   * 自定义清除 tags 的 icon
   */
  clearIcon?: React.ReactNode
  /**
   * 面板打开时回调
   */
  onOpen?: () => void
  /**
   * 面板关闭时回调
   */
  onClose?: () => void
  /**
   * 是否开启全选功能
   */
  showCheckAll?: boolean
  /**
   * 是否开启查看仅已选功能
   */
  showOnlyShowChecked?: boolean
}

// @ts-ignore
CheckSelect.HiName = 'CheckSelect'
if (__DEV__) {
  CheckSelect.displayName = 'CheckSelect'
}

const optionPrefix = getPrefixCls('check-select-option')

/**
 * TODO: What is CheckSelectOption
 */
export const CheckSelectOption = forwardRef<HTMLDivElement | null, CheckSelectOptionProps>(
  (
    {
      prefixCls = optionPrefix,
      className,
      children,
      option = {},
      onClick,
      titleRender,
      depth,
      ...rest
    },
    ref
  ) => {
    const { isCheckedId, onSelect } = useCheckSelectContext()

    const { id, disabled = false } = option
    const checked = isCheckedId(id)

    const eventNodeRef = useLatestRef(
      Object.assign({}, option, {
        disabled: disabled,
        checked: checked,
      })
    )

    const cls = cx(
      prefixCls,
      className,
      checked && `${prefixCls}--checked`,
      disabled && `${prefixCls}--disabled`
    )

    const handleOptionCheck = useCallback(
      (evt) => {
        onSelect(option, !checked)
        onClick?.(evt)
      },
      [onSelect, option, checked, onClick]
    )

    const renderTitle = useCallback(
      (node: any, titleRender?: (node: any) => React.ReactNode) => {
        // 如果 titleRender 返回 `true`，则使用默认 title
        const title = titleRender ? titleRender(node) : true

        return (
          <div className={`${prefixCls}__title`}>
            {title === true ? (
              <Checkbox checked={node.checked} disabled={node.disabled}>
                {node.title}
              </Checkbox>
            ) : (
              title
            )}
          </div>
        )
      },
      [prefixCls]
    )

    return (
      <div ref={ref} className={cls} {...rest} onClick={handleOptionCheck}>
        {renderIndent(prefixCls, depth)}
        {renderTitle(eventNodeRef.current, titleRender)}
      </div>
    )
  }
)

export interface CheckSelectOptionProps extends HiBaseHTMLProps {}

// @ts-ignore
CheckSelectOption.HiName = 'CheckSelectOption'
if (__DEV__) {
  CheckSelectOption.displayName = 'CheckSelectOption'
}

const optionGroupPrefix = getPrefixCls('select-option-group')

/**
 * TODO: What is CheckSelectOptionGroup
 */
export const CheckSelectOptionGroup = forwardRef<
  HTMLDivElement | null,
  CheckSelectOptionGroupProps
>(({ prefixCls = optionGroupPrefix, className, label, ...rest }, ref) => {
  const cls = cx(prefixCls, className)

  return (
    <div ref={ref} className={cls} {...rest}>
      <span>{label}</span>
    </div>
  )
})

export interface CheckSelectOptionGroupProps extends HiBaseHTMLProps {}

// @ts-ignore
CheckSelectOptionGroup.HiName = 'CheckSelectOptionGroup'
if (__DEV__) {
  CheckSelectOptionGroup.displayName = 'CheckSelectOptionGroup'
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
