import React, { forwardRef, useState, useMemo, useEffect } from 'react'
import type { HiBaseHTMLProps } from '@hi-ui/core'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { useCascader, UseCascaderProps } from './use-cascader'
import { MockInput } from '@hi-ui/input'
import { PopperProps } from '@hi-ui/popper'
import { DownOutlined, UpOutlined } from '@hi-ui/icons'
import { defaultLeafIcon, defaultLoadingIcon, defaultSuffixIcon } from './icons'
import { checkCanLoadChildren, flattenTreeData, getCascaderItemEventData } from './utils'
import { CascaderProvider, useCascaderContext } from './context'
import { CascaderItem, ExpandTrigger, FlattedCascaderItem, CascaderItemEventData } from './types'
import { getNodeAncestorsWithMe, getTopDownAncestors } from '@hi-ui/tree-utils'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'
import { Picker, PickerProps } from '@hi-ui/picker'
import { useSearchMode, useTreeCustomSearch, useTreeUpMatchSearch } from '@hi-ui/use-search-mode'
import { uniqBy } from 'lodash'
import { useCache } from '@hi-ui/use-cache'

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
    placeholder,
    disabled = false,
    clearable = true,
    flatted = false,
    fieldNames,
    expandTrigger = 'click',
    displayRender: displayRenderProp,
    onSelect: onSelectProp,
    onLoadChildren,
    appearance,
    invalid,
    filterOption,
    searchable: searchableProp,
    titleRender,
    overlayClassName,
    data = NOOP_ARRAY,
    onOpen,
    onClose,
    ...rest
  } = props

  const [menuVisible, menuVisibleAction] = useUncontrolledToggle({
    disabled,
    onOpen,
    onClose,
  })

  // 搜索时临时选中缓存数据
  const [selectedItem, setSelectedItem] = useState<CascaderItemEventData | null>(null)
  const onSelect = (
    value: React.ReactText,
    item: CascaderItemEventData,
    itemPaths: FlattedCascaderItem[]
  ) => {
    onSelectProp?.(value, item, itemPaths)
    setSelectedItem(item)
    // 关闭弹窗
    menuVisibleAction.off()
  }

  // 拦截 titleRender，自定义高亮展示
  const proxyTitleRender = (node: CascaderItemEventData) => {
    // 本地搜索执行默认高亮规则
    const highlight = !!searchValue && (searchMode === 'upMatch' || searchMode === 'filter')

    if (highlight) {
      return renderHighlightTitle(searchValue, node, titleRender)
    }

    return true
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
    exclude: (option: FlattedCascaderItem) => {
      return checkCanLoadChildren(option, onLoadChildren)
    },
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

  const displayRender = (item: FlattedCascaderItem) => {
    const itemPaths = getTopDownAncestors(item)

    if (displayRenderProp) {
      return displayRenderProp(item, itemPaths)
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

  const { rootProps, ...context } = useCascader({
    ...rest,
    disabled,
    fieldNames,
    // 搜索的结果列表也采用 flatted 模式进行展示
    flatted: flatted || !!searchValue,
    onSelect,
    onLoadChildren,
    data,
    // @ts-ignore
    cascaderData,
    setCascaderData,
    flattedData,
  })

  const { value, tryChangeValue, reset, menuList } = context

  const shouldUseSearch = !!searchValue
  const showData = useMemo(() => {
    if (shouldUseSearch) {
      return isArrayNonEmpty(stateInSearch.data) ? [stateInSearch.data] : []
    }
    return menuList
  }, [shouldUseSearch, stateInSearch.data, menuList])

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
        popper={{ matchWidth: false, ...rest.popper }}
        visible={menuVisible}
        disabled={disabled}
        onOpen={menuVisibleAction.on}
        onClose={menuVisibleAction.off}
        searchable={searchable}
        onSearch={onSearch}
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
  extends Omit<PickerProps, 'data' | 'onChange' | 'trigger'>,
    UseCascaderProps {
  /**
   * 次级菜单的展开方式
   */
  expandTrigger?: ExpandTrigger
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
  titleRender?: (item: CascaderItemEventData) => React.ReactNode
  /**
   * 自定义选择后触发器所展示的内容，只在 title 为字符串时有效
   */
  displayRender?: (
    checkedOption: FlattedCascaderItem,
    checkedOptionPaths: FlattedCascaderItem[]
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
  popper?: PopperProps
  /**
   * 设置展现形式
   */
  appearance?: 'outline' | 'unset' | 'filled'
}

if (__DEV__) {
  Cascader.displayName = 'Cascader'
}

const menuListPrefix = getPrefixCls('cascader-menu-list')

export const CascaderMenuList = forwardRef<HTMLDivElement | null, CascaderMenuListProps>(
  ({ prefixCls = menuListPrefix, className, ...rest }, ref) => {
    const { flatted, menuList } = useCascaderContext()

    const cls = cx(prefixCls, className, flatted && `${prefixCls}--flatted`)

    return (
      <div ref={ref} className={cls} {...rest}>
        {menuList.map((menu, menuIndex) => {
          // @ts-ignore
          return isArrayNonEmpty(menu) ? <CascaderMenu key={menuIndex} data={menu} /> : null
        })}
      </div>
    )
  }
)

export interface CascaderMenuListProps extends HiBaseHTMLProps {}

if (__DEV__) {
  CascaderMenuList.displayName = 'CascaderMenuList'
}

const menuPrefix = getPrefixCls('cascader-menu')

export const CascaderMenu = ({
  prefixCls = menuPrefix,
  role = 'menu',
  className,
  data: menu,
}: CascaderMenuProps) => {
  const {
    flatted,
    disabled: disabledContext,
    expandTrigger,
    onItemClick,
    onItemHover,
    titleRender,
    onLoadChildren,
    getCascaderItemRequiredProps,
  } = useCascaderContext()

  const cls = cx(prefixCls, className)

  return (
    <ul className={cls} role={role}>
      {menu.map((option) => {
        const eventOption = getCascaderItemEventData(option, getCascaderItemRequiredProps(option))

        const { selected, loading } = eventOption
        const disabled = disabledContext || option.disabled

        const optionCls = cx(
          `${prefixCls}-option`,
          loading && `${prefixCls}-option--loading`,
          disabled && `${prefixCls}-option--disabled`,
          selected && `${prefixCls}-option--selected`
        )

        return (
          <li key={option.id} role="menu-item" className={`${prefixCls}-item`}>
            <div
              className={optionCls}
              onClick={() => {
                if (disabled) return
                onItemClick(eventOption)
              }}
              onMouseEnter={() => {
                if (disabled) return
                if (expandTrigger === 'hover') {
                  onItemHover(eventOption)
                }
              }}
            >
              {flatted ? (
                renderFlattedTitle(eventOption, titleRender)
              ) : (
                <>
                  {renderDefaultTitle(eventOption, titleRender)}
                  {renderSuffix(prefixCls, option, loading, onLoadChildren)}
                </>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export interface CascaderMenuProps extends HiBaseHTMLProps {
  /**
   * 设置选择项数据源
   */
  data: FlattedCascaderItem[]
}

/**
 * 渲染菜单子项的展开提示图标
 */
const renderSuffix = (
  prefixCls: string,
  item: FlattedCascaderItem,
  loading: boolean,
  onLoadChildren?: (item: CascaderItemEventData) => Promise<CascaderItem[] | void> | void
) => {
  if (loading) {
    return (
      <span className={cx(`${prefixCls}-switcher`, `${prefixCls}-switcher--loading`)}>
        {defaultLoadingIcon}
      </span>
    )
  }

  const canLoadChildren = checkCanLoadChildren(item, onLoadChildren)

  if (canLoadChildren) {
    return (
      <span className={cx(`${prefixCls}-switcher`, `${prefixCls}-switcher--arrow`)}>
        {defaultSuffixIcon}
      </span>
    )
  }

  return (
    <span className={cx(`${prefixCls}-switcher`, `${prefixCls}-switcher--noop`)}>
      {defaultLeafIcon}
    </span>
  )
}

const renderFlattedTitle = (
  option: CascaderItemEventData,
  titleRender?: (item: CascaderItemEventData, flatted: boolean) => React.ReactNode
) => {
  // 如果 titleRender 返回 `true`，则使用默认 title
  const title = titleRender ? titleRender(option, true) : true
  if (title !== true) return title

  return (
    <span className="title__text title__text--cols">
      {getTopDownAncestors(option).map((item) => (
        <span key={item.id} className="title__text--col">
          {item.title}
        </span>
      ))}
    </span>
  )
}

const renderDefaultTitle = (
  option: CascaderItemEventData,
  titleRender?: (item: CascaderItemEventData, flatted: boolean) => React.ReactNode
) => {
  // 如果 titleRender 返回 `true`，则使用默认 title
  const title = titleRender ? titleRender(option, false) : true
  if (title !== true) return title

  return <span className="title__text">{option.title}</span>
}

const renderHighlightTitle = (
  keyword: string,
  option: CascaderItemEventData,
  titleRender?: (item: CascaderItemEventData, flatted: boolean) => React.ReactNode
) => {
  // 如果 titleRender 返回 `true`，则使用默认 title
  const title = titleRender ? titleRender(option, true) : true
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
