import React, { forwardRef, useMemo, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import {
  CascaderItem,
  ExpandTrigger,
  CascaderItemEventData,
  FlattedCascaderItem,
  CascaderItemRequiredProps,
} from './types'
import Input from '@hi-ui/input'
import { SearchOutlined } from '@hi-ui/icons'
import { useCache, useSearch, useSelect, useAsyncSwitch } from './hooks'
import { flattenTreeData, getNodeAncestors, getActiveMenus, getFlattedMenus } from './utils'
import { CascaderProvider } from './context'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'

const _role = 'cascader-panel'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is CascaderPanel
 */
export const CascaderPanel = forwardRef<HTMLDivElement | null, CascaderPanelProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      data,
      flattedData: flattedDataProp,
      value: valueProp,
      defaultValue = '',
      disabled = false,
      changeOnSelect = false,
      searchable = true,
      flatted: flattedProp = false,
      upMatch = false,
      expandTrigger = 'click',
      emptyContent = '无匹配选项',
      placeholder,
      onChange,
      onSelect,
      titleRender,
      onLoadChildren,
      ...rest
    },
    ref
  ) => {
    const [cascaderData, setCascaderData] = useCache(data)

    const flattedData = useMemo(() => flattenTreeData(cascaderData), [cascaderData])

    // 单击选中某项
    const [selectedId, onOptionSelect] = useSelect(disabled, valueProp, onSelect)

    // 选中 id 路径
    const selectedIds = useMemo(() => getActiveMenuIds(flattedData, selectedId), [
      flattedData,
      selectedId,
    ])

    // 存在异步加载数据的情况，单击选中时需要控制异步加载状态
    const [isLoadingId, onItemExpand] = useAsyncSwitch(
      setCascaderData,
      onOptionSelect,
      onLoadChildren
    )

    const [inSearch, matchedItems, inputProps, isEmpty] = useSearch(flattedData, upMatch)

    const renderTitleWithSearch = useCallback(
      (option: CascaderItemEventData) => {
        // 如果 titleRender 返回 `true`，则使用默认 title
        const title = titleRender ? titleRender(option, false) : true
        if (title !== true) return title

        if (!inSearch) return true
        if (typeof option.title !== 'string') return true

        const searchValue = inputProps.value
        let found = false

        return (
          <span className={cx(`title__text`, `title__text--cols`)}>
            {getNodeAncestors(option)
              .reverse()
              .map((item) => {
                const { title, id } = item
                const raw = (
                  <span className="title__text--col" key={id}>
                    {title}
                  </span>
                )

                if (typeof title !== 'string') return raw
                if (found) return raw

                const index = title.indexOf(searchValue)
                if (index === -1) return raw

                found = true

                const beforeStr = title.substr(0, index)
                const afterStr = title.substr(index + searchValue.length)

                return (
                  <span className={`title__text--col`} key={id}>
                    {beforeStr}
                    <span className="title__text--matched">{searchValue}</span>
                    {afterStr}
                  </span>
                )
              })}
          </span>
        )
      },
      [titleRender, inSearch, inputProps.value]
    )

    // 搜索的结果列表也采用 flatted 模式进行展示
    const flatted = flattedProp || inSearch
    const flattedCascaderData = inSearch ? matchedItems : flattedData

    const menus = useMemo(() => {
      return flatted
        ? getFlattedMenus(flattedCascaderData)
        : getActiveMenus(flattedData, selectedId)
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

    const providedValue = useMemo(
      () => ({
        expandTrigger,
        onSelect: onItemExpand,
        flatted: flatted,
        changeOnSelect,
        titleRender: renderTitleWithSearch,
        onLoadChildren,
        disabled,
        getCascaderItemRequiredProps,
      }),
      [
        disabled,
        changeOnSelect,
        expandTrigger,
        flatted,
        onItemExpand,
        onLoadChildren,
        renderTitleWithSearch,
        getCascaderItemRequiredProps,
      ]
    )

    const cls = cx(
      prefixCls,
      className,
      flatted && `${prefixCls}--flatted`,
      changeOnSelect && `${prefixCls}--selectchange`
    )

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {searchable ? (
          <div className={`${prefixCls}-search`}>
            <Input
              appearance="underline"
              placeholder={placeholder}
              prefix={<SearchOutlined />}
              value={inputProps.value}
              onChange={inputProps.onChange}
            />
            {isEmpty ? <span className={`${prefixCls}-search__empty`}>{emptyContent}</span> : null}
          </div>
        ) : null}

        <CascaderProvider value={providedValue}>
          <div className={`${prefixCls}-menu`}>
            {menus.map((menu, menuIndex) => {
              return isArrayNonEmpty(menu) ? <CascaderMenu key={menuIndex} data={menu} /> : null
            })}
          </div>
        </CascaderProvider>
      </div>
    )
  }
)

export interface CascaderPanelProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 组件的注入样式
   */
  style?: React.CSSProperties
  /**
   * 设置选择项数据源
   */
  data: CascaderItem[]
  /**
   * 设置当前多选值
   */
  value?: React.ReactText
  /**
   * 设置当前多选值默认值
   */
  defaultValue?: React.ReactText
  /**
   * 多选值改变时的回调
   */
  onChange?: (values: React.ReactText) => void
  /**
   * 选项被点击时的回调
   */
  onSelect?: (selectedId: React.ReactText, selectedOption: CascaderItemEventData) => void
  /**
   * 次级菜单的展开方式
   */
  expandTrigger?: ExpandTrigger
  /**
   * 是否可搜索
   */
  searchable?: boolean
  /**
   * 是否禁止使用
   */
  disabled?: boolean
  /**
   * 设置选项为空时展示的内容
   */
  emptyContent?: React.ReactNode
  /**
   * 是否启用选择即改变功能
   */
  changeOnSelect?: boolean
  /**
   * 自定义渲染节点的 title 内容
   */
  titleRender?: (item: CascaderItemEventData, flatted: boolean) => React.ReactNode
  /**
   * 支持 checkbox 级联（正反选）功能
   */
  checkCascaded?: boolean
  /**
   * 将 check 子项拍平展示
   */
  flatted?: boolean
  /**
   * 开启全量搜索，默认只对开启 checkable 的选项进行搜索，不向上查找路径
   */
  upMatch?: boolean
  /**
   * 搜索输入框占位符
   */
  placeholder?: string
  /**
   * 异步请求更新数据
   */
  onLoadChildren?: (item: CascaderItemEventData) => Promise<CascaderItem[] | void> | void
  flattedData?: FlattedCascaderItem[]
}

if (__DEV__) {
  CascaderPanel.displayName = 'CascaderPanel'
}
