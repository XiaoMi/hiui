import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useCheckSelect, UseCheckSelectProps } from './use-check-select'
import type { HiBaseHTMLProps, HiBaseSizeEnum } from '@hi-ui/core'
import { DownOutlined, UpOutlined } from '@hi-ui/icons'
import { CheckSelectProvider, useCheckSelectContext } from './context'
import {
  CheckSelectAppearanceEnum,
  CheckSelectDataItem,
  CheckSelectItemEventData,
  CheckSelectMergedItem,
} from './types'
import { useLatestCallback, useLatestRef } from '@hi-ui/use-latest'
import Checkbox from '@hi-ui/checkbox'
import { TagInputMock, TagInputMockProps } from '@hi-ui/tag-input'
import { isFunction, isArrayNonEmpty, isUndef } from '@hi-ui/type-assertion'
import VirtualList, { ListRef, useCheckInVirtual } from '@hi-ui/virtual-list'
import { Picker, PickerProps, PickerHelper } from '@hi-ui/picker'
import { mockDefaultHandlers } from '@hi-ui/dom-utils'
import { times, uniqBy } from '@hi-ui/array-utils'
import { Highlighter } from '@hi-ui/highlighter'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { UseDataSource } from '@hi-ui/use-data-source'
import { callAllFuncs } from '@hi-ui/func-utils'
import { useLocaleContext } from '@hi-ui/core'
import {
  useAsyncSearch,
  useFilterSearch,
  useSearchMode,
  useTreeCustomSearch,
} from '@hi-ui/use-search-mode'
import { flattenData } from './hooks'
import { getAllCheckedStatus, isCheckableOption, isOption } from './utils'

const _role = 'check-select'
const _prefix = getPrefixCls(_role)

const DEFAULT_FIELD_NAMES = {} as any

/**
 * 多项选择器
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
      showCheckAll = false,
      showOnlyShowChecked = false,
      placeholder: placeholderProp,
      displayRender: displayRenderProp,
      onSelect: onSelectProp,
      height,
      itemHeight = 40,
      virtual = true,
      visible,
      onOpen,
      onClose,
      onClear,
      // picker
      appearance,
      invalid,
      // search
      dataSource,
      searchOnInit,
      filterOption,
      searchable: searchableProp,
      render: titleRender,
      renderExtraFooter,
      onSearch: onSearchProp,
      fieldNames = DEFAULT_FIELD_NAMES,
      checkedOnEntered = true,
      customRender,
      tagInputProps,
      size = 'md',
      prefix,
      suffix,
      onKeyDown: onKeyDownProp,
      keyword: keywordProp,
      label,
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

    const pickerInnerRef = useRef<PickerHelper>(null)

    const [menuVisible, menuVisibleAction] = useUncontrolledToggle({
      visible,
      disabled,
      onOpen,
      onClose,
    })

    const displayRender = useCallback(
      (item: CheckSelectItemEventData) => {
        if (isFunction(displayRenderProp)) {
          return displayRenderProp(item)
        }
        return item.title
      },
      [displayRenderProp]
    )

    const { rootProps, ...context } = useCheckSelect({
      ...rest,
      children,
      fieldNames,
      onSelect: onSelectProp,
    })

    const { value, tryChangeValue, flattedData, checkedItems, onSelect, isCheckedId } = context
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
      keyword: keywordProp,
      strategies: [dataSourceStrategy, customSearchStrategy, filterSearchStrategy],
      searchOnInit,
    })

    // 拦截 titleRender，自定义高亮展示
    const proxyTitleRender = useCallback(
      (node: CheckSelectItemEventData) => {
        if (titleRender) {
          const ret = titleRender(node)
          if (ret && ret !== true) return ret
        }

        // 本地搜索执行默认高亮规则
        const highlight = !!searchValue && (searchMode === 'filter' || searchMode === 'dataSource')

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

    const shouldUseSearch = (!!searchValue || searchOnInit) && !hasError
    const showData = useMemo(() => {
      return shouldUseSearch ? stateInSearch.data : flattedData
    }, [shouldUseSearch, flattedData, stateInSearch.data])

    // 根据 id 进行合并，注意必须是扁平数据
    const mergedData: any[] = useMemo(() => {
      const nextData = checkedItems.concat(flattedData as any[])
      return uniqBy(nextData, 'id')
    }, [checkedItems, flattedData])

    const mergedCheckedItems = useMemo(() => {
      if (typeof customRender !== 'function') {
        return []
      }

      if (!Array.isArray(value)) {
        return []
      }

      return value.map((id) => {
        return (
          mergedData.find((item: CheckSelectItemEventData) => item.id === id) || {
            id,
            title: id,
          }
        )
      })
    }, [customRender, mergedData, value])

    const [filterItems, setFilterItems] = useState<any[] | null>(null)
    const dropdownItems = filterItems || showData
    const activeExpandable = showOnlyShowChecked && !!filterItems && menuVisible

    const [showAllChecked, showIndeterminate] = useMemo(() => {
      return getAllCheckedStatus(dropdownItems, value, isOption)
    }, [dropdownItems, value])

    const valueLatestRef = useLatestRef(value)
    const toggleCheckAll = useCallback(() => {
      const value = valueLatestRef.current
      const [currentAllChecked] = getAllCheckedStatus(dropdownItems, value, isCheckableOption)
      const shouldChecked = !currentAllChecked

      // 当前页的数据选项
      const items = dropdownItems.filter(isCheckableOption)
      const targetIds: any[] = items.map(({ id }: any) => id)
      const allData: any[] = uniqBy(items.concat(mergedData), 'id')

      if (shouldChecked) {
        const nextCheckedIds = Array.from(new Set(value.concat(targetIds)))
        const changedIds = nextCheckedIds.filter((id) => !value.includes(id))
        const changedItems = allData.filter(({ id }) => changedIds.includes(id))

        tryChangeValue(nextCheckedIds, changedItems, shouldChecked)
      } else {
        const nextCheckedIds = value.filter((id) => !targetIds.includes(id))
        const changedIds = value.filter((id) => !nextCheckedIds.includes(id))
        const changedItems = allData.filter(({ id }) => changedIds.includes(id)) // items

        tryChangeValue(nextCheckedIds, changedItems, shouldChecked)
      }
    }, [dropdownItems, mergedData, valueLatestRef, tryChangeValue])

    // ************************** 回车选中处理 ************************* //

    const defaultIndex = showData.findIndex((item: CheckSelectDataItem) => !item.disabled)

    const [focusedIndex, setFocusedIndex] = useState<number>(defaultIndex)

    const handleKeyDown = useLatestCallback((evt: React.KeyboardEvent) => {
      const { key } = evt

      if (key === 'Enter' && checkedOnEntered) {
        const focusedItem = showData[focusedIndex]

        if (focusedItem) {
          onSelect(focusedItem, !isCheckedId(focusedItem.id))
        }
      }
    })

    // 更新 focused 索引
    useEffect(() => {
      setFocusedIndex(defaultIndex)
    }, [defaultIndex, menuVisible])

    const renderDefaultFooter = () => {
      const extra = renderExtraFooter ? renderExtraFooter() : null
      if (showCheckAll) {
        return (
          <>
            <Checkbox
              indeterminate={showIndeterminate}
              checked={showAllChecked}
              onChange={toggleCheckAll}
            >
              {i18n.get('checkSelect.checkAll')}
            </Checkbox>
            {extra}
          </>
        )
      }
      return extra
    }

    const expandedViewRef = useRef<'normal' | 'onlyChecked'>('normal')

    const virtualListProps = {
      height: height,
      itemHeight: itemHeight,
      virtual: virtual,
      data: dropdownItems,
    }

    const { inVirtual } = useCheckInVirtual(virtualListProps)

    const cls = cx(prefixCls, className, `${prefixCls}--${menuVisible ? 'open' : 'closed'}`)

    const listRef = useRef<ListRef>(null)

    useEffect(() => {
      if (menuVisible) {
        // 数据改变时更新弹窗显示位置，避免弹窗内容被遮挡
        pickerInnerRef.current?.update()

        // 数据改变时触发一次滚动条显示
        if (isArrayNonEmpty(showData)) {
          listRef.current?.scrollTo(undefined as any)
        }
      }
    }, [menuVisible, showData])

    return (
      <CheckSelectProvider value={context}>
        <Picker
          ref={ref}
          innerRef={pickerInnerRef}
          className={cls}
          {...rootProps}
          visible={menuVisible}
          disabled={disabled}
          onOpen={menuVisibleAction.on}
          onClose={menuVisibleAction.off}
          onKeyDown={mockDefaultHandlers(handleKeyDown, onKeyDownProp)}
          keyword={keywordProp}
          searchable={searchable}
          scrollable={!inVirtual}
          onSearch={callAllFuncs(onSearchProp, onSearch)}
          loading={rest.loading !== undefined ? rest.loading : loading}
          footer={renderDefaultFooter()}
          trigger={
            customRender ? (
              typeof customRender === 'function' ? (
                customRender(mergedCheckedItems)
              ) : (
                customRender
              )
            ) : (
              <TagInputMock
                style={{ maxWidth: appearance === 'contained' ? '360px' : undefined }}
                {...tagInputProps}
                size={size}
                clearable={clearable}
                placeholder={placeholder}
                // @ts-ignore
                displayRender={displayRender}
                prefix={prefix}
                suffix={[menuVisible ? <UpOutlined /> : <DownOutlined />, suffix]}
                focused={menuVisible}
                appearance={appearance}
                label={label}
                value={value}
                // @ts-ignore
                onChange={tryChangeValue}
                onClear={onClear}
                data={mergedData}
                invalid={invalid}
                onClick={(evt) => {
                  if (!showOnlyShowChecked) return
                  if (disabled) return

                  // 阻止 Picker 调用 onOpen/onClose
                  evt.preventDefault()

                  if (filterItems) {
                    setFilterItems(null)
                  }

                  if (menuVisible) {
                    if (expandedViewRef.current === 'normal') {
                      menuVisibleAction.off()
                    }
                  } else {
                    menuVisibleAction.on()
                  }

                  expandedViewRef.current = 'normal'
                }}
                expandable={showOnlyShowChecked}
                activeExpandable={activeExpandable}
                onExpand={(evt) => {
                  if (!showOnlyShowChecked) return
                  if (disabled) return

                  // 阻止冒泡触发外层 onClick
                  evt.stopPropagation()
                  evt.preventDefault()

                  setFilterItems(() => {
                    return mergedData.filter((item) => {
                      return value.includes(item.id)
                    })
                  })

                  if (menuVisible) {
                    if (expandedViewRef.current !== 'normal') {
                      menuVisibleAction.off()
                    }
                  } else {
                    menuVisibleAction.on()
                  }

                  expandedViewRef.current = 'onlyChecked'
                }}
              />
            )
          }
        >
          {isArrayNonEmpty(dropdownItems) ? (
            <VirtualList ref={listRef} itemKey="id" fullHeight={false} {...virtualListProps}>
              {(node: any, index) => {
                /* 反向 map，搜索删选数据时会对数据进行处理 */
                return 'groupTitle' in node ? (
                  <CheckSelectOptionGroup label={node.groupTitle} depth={node.depth} />
                ) : (
                  <CheckSelectOption
                    option={node}
                    depth={node.depth}
                    titleRender={proxyTitleRender}
                    onMouseEnter={() => {
                      !node.disabled && setFocusedIndex(index)
                    }}
                    focused={focusedIndex === index}
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

export interface CheckSelectProps
  extends Omit<PickerProps, 'trigger' | 'scrollable'>,
    UseCheckSelectProps {
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
   * 是否可清空
   */
  clearable?: boolean
  /**
   * 是否点击清理 tags
   */
  onClear?: () => void
  /**
   * 自定义尺寸
   */
  size?: HiBaseSizeEnum
  /**
   * 自定义渲染节点的 title 内容
   */
  render?: (item: CheckSelectItemEventData) => React.ReactNode
  /**
   * 自定义选择后触发器所展示的内容，只在 title 为字符串时有效
   */
  displayRender?: (option: CheckSelectItemEventData) => React.ReactNode
  /**
   * 触发器输入框占位符
   */
  placeholder?: string
  /**
   * 设置展现形式
   */
  appearance?: CheckSelectAppearanceEnum
  /**
   * 设置输入框 label 内容，仅在 appearance 为 contained 时生效
   */
  label?: React.ReactNode
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
  dataSource?: UseDataSource<CheckSelectMergedItem[]>
  /**
   * 初始化时执行一次搜索，仅在 dataSource 不为空时有效
   */
  searchOnInit?: boolean
  /**
   * 自定义下拉菜单底部渲染
   */
  renderExtraFooter?: () => React.ReactNode
  /**
   * 选择框前置内容
   */
  prefix?: React.ReactNode
  /**
   * 选择框后置内容
   */
  suffix?: React.ReactNode
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
  /**
   * 按Enter键是否选中当前项
   */
  checkedOnEntered?: boolean
  /**
   * 自定义渲染选中的内容
   */
  customRender?: React.ReactNode | ((option: CheckSelectItemEventData[]) => React.ReactNode)
  /**
   * TagInput 参数设置
   */
  tagInputProps?: TagInputMockProps
}

// @ts-ignore
CheckSelect.HiName = 'CheckSelect'
if (__DEV__) {
  CheckSelect.displayName = 'CheckSelect'
}

const optionPrefix = getPrefixCls('check-select-option')

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
      focused,
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
      disabled && `${prefixCls}--disabled`,
      focused && `${prefixCls}--focused`
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

export const CheckSelectOptionGroup = forwardRef<
  HTMLDivElement | null,
  CheckSelectOptionGroupProps
>(({ prefixCls = optionGroupPrefix, className, label, depth, ...rest }, ref) => {
  const cls = cx(prefixCls, className)

  return (
    <div ref={ref} className={cls} {...rest}>
      {renderIndent(prefixCls, !depth || depth === 0 ? 0 : depth - 1)}
      <span>{label}</span>
    </div>
  )
})

export interface CheckSelectOptionGroupProps extends HiBaseHTMLProps {
  /**
   * 深度
   */
  depth?: number
}

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
