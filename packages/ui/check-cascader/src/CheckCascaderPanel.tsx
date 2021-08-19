import React, { forwardRef, useMemo, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { CheckCascaderItem, ExpandTrigger, CheckCascaderItemEventData } from './types'
import Input from '@hi-ui/input'
import { useCache, useSearch } from './hooks'
import { flattenTreeData, getNodeAncestors } from './utils'
import { SearchOutlined } from '@hi-ui/icons'
import { CheckCascaderMenus } from './CheckCascaderMenus'

const _role = 'check-cascader-panel'
const _prefix = getPrefixCls(_role)

const NOOP_ARRAY = [] as []

/**
 * TODO: What is CheckCascaderPanel
 */
export const CheckCascaderPanel = forwardRef<HTMLDivElement | null, CheckCascaderPanelProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      data,
      value,
      defaultValue = NOOP_ARRAY,
      disabled = false,
      expandTrigger = 'click',
      changeOnSelect = false,
      checkCascaded = false,
      searchable = true,
      flatted = false,
      upMatch = false,
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

    const [inSearch, matchedNodes, inputProps, isEmpty] = useSearch(flattedData, upMatch)

    const renderTitleWithSearch = useCallback(
      (option: CheckCascaderItemEventData) => {
        // 如果 titleRender 返回 `true`，则使用默认 title
        const title = titleRender ? titleRender(option) : true

        if (title !== true) {
          return title
        }

        if (!inSearch) return true
        if (typeof option.title !== 'string') return true

        const searchValue = inputProps.value
        let found = false

        return (
          <span className={cx(`title__text`, `title__text--cols`)}>
            {getNodeAncestors(option)
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
              })
              .reverse()}
          </span>
        )
      },
      [titleRender, inSearch, inputProps.value]
    )

    const cls = cx(prefixCls, className)

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
        <CheckCascaderMenus
          {...{
            disabled,
            value,
            defaultValue,
            onChange,
            expandTrigger,
            changeOnSelect,
            checkCascaded,
            onSelect,
            onLoadChildren,
          }}
          data={cascaderData}
          onChangeData={setCascaderData}
          titleRender={renderTitleWithSearch}
          flatted={flatted || inSearch}
          flattedData={inSearch ? matchedNodes : flattedData}
        />
      </div>
    )
  }
)

export interface CheckCascaderPanelProps {
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
  data: CheckCascaderItem[]
  /**
   * 设置当前多选值
   */
  value?: React.ReactText[]
  /**
   * 设置当前多选值默认值
   */
  defaultValue?: React.ReactText[]
  /**
   * 多选值改变时的回调
   */
  onChange?: (
    values: React.ReactText[],
    checkedOption: CheckCascaderItemEventData,
    checked: boolean
  ) => void
  /**
   * 选项被点击时的回调
   */
  onSelect?: (selectedId: React.ReactText, selectedOption: CheckCascaderItemEventData) => void
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
  titleRender?: (item: CheckCascaderItemEventData) => React.ReactNode
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
  onLoadChildren?: (item: CheckCascaderItemEventData) => Promise<CheckCascaderItem[] | void> | void
}

if (__DEV__) {
  CheckCascaderPanel.displayName = 'CheckCascaderPanel'
}
