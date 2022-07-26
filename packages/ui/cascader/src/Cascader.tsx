import React, { forwardRef, useState, useMemo, useEffect } from 'react'
import type { HiBaseAppearanceEnum } from '@hi-ui/core'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { useCascader, UseCascaderProps } from './use-cascader'
import { MockInput } from '@hi-ui/input'
import type { PopperOverlayProps } from '@hi-ui/popper'
import { DownOutlined, UpOutlined } from '@hi-ui/icons'
import { flattenTreeData, getItemEventData, getFilteredMenuList } from './utils'
import { CascaderProvider } from './context'
import { CascaderExpandTriggerEnum, FlattedCascaderDataItem, CascaderItemEventData } from './types'
import { getNodeAncestorsWithMe, getTopDownAncestors } from '@hi-ui/tree-utils'
import { isArrayNonEmpty, isFunction, isUndef } from '@hi-ui/type-assertion'
import { Picker, PickerProps } from '@hi-ui/picker'
import { useSearchMode, useTreeCustomSearch, useTreeUpMatchSearch } from '@hi-ui/use-search-mode'
import { uniqBy } from '@hi-ui/array-utils'
import { useCache } from '@hi-ui/use-cache'
import { useLocaleContext } from '@hi-ui/core'
import { callAllFuncs } from '@hi-ui/func-utils'
import { CascaderMenuList } from './CascaderMenuList'
import Highlighter from '@hi-ui/highlighter'

const _prefix = getPrefixCls('cascader')

const NOOP_ARRAY = [] as []

/**
 * TODO: What is Cascader
 * Trigger + MenuList + Search
 */
export const Cascader = forwardRef<HTMLDivElement | null, CascaderProps>((props, ref) => {
  const {
    prefixCls = _prefix,
    className,
    placeholder: placeholderProp,
    disabled = false,
    clearable = true,
    type = 'tree',
    fieldNames,
    expandTrigger = 'click',
    displayRender: displayRenderProp,
    onSelect: onSelectProp,
    onLoadChildren,
    appearance,
    invalid,
    filterOption,
    searchable: searchableProp,
    onSearch: onSearchProp,
    render: titleRender,
    overlayClassName,
    data = NOOP_ARRAY,
    flattedSearchResult = true,
    visible,
    onOpen,
    onClose,
    ...rest
  } = props
  const i18n = useLocaleContext()

  const placeholder = isUndef(placeholderProp) ? i18n.get('cascader.placeholder') : placeholderProp

  const [menuVisible, menuVisibleAction] = useUncontrolledToggle({
    visible,
    disabled,
    onOpen,
    onClose,
  })

  // 搜索时临时选中缓存数据
  const [selectedItem, setSelectedItem] = useState<CascaderItemEventData | null>(null)
  const onSelect = (
    value: React.ReactText,
    item: CascaderItemEventData,
    itemPaths: FlattedCascaderDataItem[]
  ) => {
    onSelectProp?.(value, item, itemPaths)
    setSelectedItem(item)
    // 关闭弹窗
    menuVisibleAction.off()
  }

  // 拦截 titleRender，自定义高亮展示
  const proxyTitleRender = (node: CascaderItemEventData) => {
    // 本地搜索执行默认高亮规则
    const highlight = !!searchValue && searchMode === 'upMatch'

    if (highlight) {
      return flattedSearchResult
        ? renderHighlightTitles(searchValue, node, titleRender)
        : renderHighlightTitle(searchValue, node, titleRender)
    }

    return isFunction(titleRender) ? titleRender(node) : true
  }

  const [cascaderData, setCascaderData] = useCache(data)

  const flattedData = useMemo(() => flattenTreeData(cascaderData, fieldNames), [
    cascaderData,
    fieldNames,
  ])

  // ************************** 异步搜索 ************************* //

  // TODO: 支持对 Item 传入 状态
  const customSearchStrategy = useTreeCustomSearch({ data: flattedData, filterOption })

  const upMatchSearchStrategy = useTreeUpMatchSearch({
    data: cascaderData,
    flattedData: flattedData,
    enabled: searchableProp,
    exclude: (node: any) => node.disabled,
    // exclude: (option: FlattedCascaderDataItem) => {
    //   return checkCanLoadChildren(option, onLoadChildren)
    // },
  })

  const {
    state: stateInSearch,
    searchable,
    searchMode,
    onSearch,
    keyword: searchValue,
  } = useSearchMode({
    searchable: searchableProp,
    strategies: [customSearchStrategy, upMatchSearchStrategy],
  })

  const displayRender = (item: CascaderItemEventData) => {
    const itemPaths = getTopDownAncestors(item)

    if (displayRenderProp) {
      const eventOption = getItemEventData(item, getItemRequiredProps(item))

      return displayRenderProp(
        eventOption,
        itemPaths.map((item) => getItemEventData(item, getItemRequiredProps(item)))
      )
    }

    const mergedTitle = itemPaths.reduce((acc, item, index, { length }) => {
      acc.push(item.title as string)

      if (length - 1 !== index) {
        acc.push('/')
      }

      return acc
    }, [] as string[])

    return <span className="title__text">{mergedTitle}</span>
  }

  const shouldUseSearch = !!searchValue
  // 搜索的结果列表也采用 flatted 模式进行展示
  const flatted = shouldUseSearch ? flattedSearchResult : type === 'flatted'

  const { rootProps, ...context } = useCascader({
    ...rest,
    disabled,
    fieldNames,
    flatted,
    onSelect,
    onLoadChildren,
    data,
    // @ts-ignore
    cascaderData,
    setCascaderData,
    flattedData,
  })

  const { value, tryChangeValue, reset, menuList, getItemRequiredProps } = context

  const showData = useMemo(() => {
    if (shouldUseSearch) {
      if (!flattedSearchResult) {
        return getFilteredMenuList(menuList, stateInSearch.data)
      }
      return isArrayNonEmpty(stateInSearch.data) ? [stateInSearch.data] : []
    }

    return menuList
  }, [shouldUseSearch, flattedSearchResult, stateInSearch.data, menuList])

  useEffect(() => {
    // 关闭展示后，重置展开要高亮的选项
    if (!menuVisible) {
      reset()
    }
  }, [menuVisible, reset])

  // 下拉菜单不能合并（因为树形数据，不知道是第几级）
  const mergedData = useMemo(() => {
    if (selectedItem) {
      const nextData = [selectedItem].concat(flattedData as any[])
      return uniqBy(nextData, 'id')
    }

    return flattedData
  }, [selectedItem, flattedData])

  const cls = cx(prefixCls, className, `${prefixCls}--${menuVisible ? 'open' : 'closed'}`)

  return (
    <CascaderProvider
      value={{ ...context, expandTrigger, titleRender: proxyTitleRender, menuList: showData }}
    >
      <Picker
        ref={ref}
        className={cls}
        overlayClassName={cx(`${prefixCls}__popper`, overlayClassName)}
        {...rootProps}
        // 这种展现形式宽度是不固定的，关掉宽度匹配策略
        overlay={{ matchWidth: false, ...rest.overlay }}
        visible={menuVisible}
        disabled={disabled}
        onOpen={menuVisibleAction.on}
        onClose={menuVisibleAction.off}
        searchable={searchable}
        scrollable={false}
        onSearch={callAllFuncs(onSearchProp, onSearch)}
        trigger={
          <MockInput
            clearable={clearable}
            placeholder={placeholder}
            displayRender={displayRender as any}
            suffix={menuVisible ? <UpOutlined /> : <DownOutlined />}
            focused={menuVisible}
            value={value[value.length - 1]}
            onChange={() => {
              tryChangeValue([])
            }}
            data={mergedData}
            invalid={invalid}
            appearance={appearance}
          />
        }
      >
        {isArrayNonEmpty(showData) ? <CascaderMenuList /> : null}
      </Picker>
    </CascaderProvider>
  )
})

export interface CascaderProps
  extends Omit<PickerProps, 'data' | 'onChange' | 'trigger' | 'scrollable'>,
    UseCascaderProps {
  /**
   * 将 check 子项拍平展示。暂不对外暴露
   * @private
   */
  type?: 'flatted' | 'tree'
  /**
   * 次级菜单的展开方式
   */
  expandTrigger?: CascaderExpandTriggerEnum
  /**
   * 是否可搜索（仅在 title 为字符串时支持）
   */
  searchable?: boolean
  /**
   * 是否可清空
   */
  clearable?: boolean
  /**
   * 设置选项为空时展示的内容
   */
  emptyContent?: React.ReactNode
  /**
   * 自定义渲染节点的 title 内容
   */
  render?: (item: CascaderItemEventData, keyword?: string) => React.ReactNode
  /**
   * 自定义选择后触发器所展示的内容，只在 title 为字符串时有效
   */
  displayRender?: (
    checkedOption: CascaderItemEventData,
    checkedOptionPaths: CascaderItemEventData[]
  ) => React.ReactNode
  /**
   * 触发器输入框占位符
   */
  placeholder?: string
  /**
   * 搜索输入框占位符
   */
  searchPlaceholder?: string
  /**
   * 自定义搜索过滤器，仅在 searchable 为 true 时有效
   * 第一个参数为输入的关键字，
   * 第二个为数据项，返回值为 true 时将出现在结果项
   */
  filterOption?: (keyword: string, item: CascaderItemEventData) => boolean
  /**
   * 自定义控制 popper 行为
   */
  overlay?: PopperOverlayProps
  /**
   * 设置展现形式
   */
  appearance?: HiBaseAppearanceEnum
  /**
   * 搜索结果拍平展示
   */
  flattedSearchResult?: boolean
}

if (__DEV__) {
  Cascader.displayName = 'Cascader'
}

const renderHighlightTitle = (
  keyword: string,
  option: CascaderItemEventData,
  titleRender?: (item: CascaderItemEventData, keyword?: string) => React.ReactNode
) => {
  // 如果 titleRender 返回 `true`，则使用默认 title
  const title = titleRender ? titleRender(option, keyword) : true
  if (title !== true) return title

  return (
    <Highlighter key={option.id} keyword={keyword}>
      {option.title}
    </Highlighter>
  )
}

const renderHighlightTitles = (
  keyword: string,
  option: CascaderItemEventData,
  titleRender?: (item: CascaderItemEventData, keyword?: string) => React.ReactNode
) => {
  // 如果 titleRender 返回 `true`，则使用默认 title
  const title = titleRender ? titleRender(option, keyword) : true
  if (title !== true) return title

  if (typeof option.title !== 'string') {
    console.info('WARNING: The `option.title` should be `string` when searchable is enabled.')
    return option.title
  }

  let found = false

  return (
    <span className={cx(`title__text`, `title__text--cols`)}>
      {/* 从下至顶展示高亮 title */}
      {getNodeAncestorsWithMe(option)
        .map((item) => {
          const { title, id } = item
          const raw = (
            <span className="title__text--col" key={id}>
              {title}
            </span>
          )

          if (typeof title !== 'string') return raw
          if (found) return raw

          const index = title.indexOf(keyword)
          if (index === -1) return raw

          found = true

          const beforeStr = title.substr(0, index)
          const afterStr = title.substr(index + keyword.length)

          return (
            <span key={id} className="title__text--col">
              {beforeStr}
              <span className="title__text--matched">{keyword}</span>
              {afterStr}
            </span>
          )
        })
        .reverse()}
    </span>
  )
}
