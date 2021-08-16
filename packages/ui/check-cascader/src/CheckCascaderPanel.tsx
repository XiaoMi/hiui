import React, { forwardRef, useMemo, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { CheckCascaderItem, ExpandTrigger, FlattedCheckCascaderItem } from './types'
import Input from '@hi-ui/input'
import { useSearch } from './hooks'
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
      clearable = false,
      flatted = false,
      emptyContent = '无匹配选项',
      displayRender,
      onChange,
      onSelect,
      titleRender,
      ...rest
    },
    ref
  ) => {
    const flattedData = useMemo(() => flattenTreeData(data), [data])
    const [inSearch, matchedNodes, inputProps, isEmpty] = useSearch(flattedData)

    const cls = cx(prefixCls, className)

    const renderTitleWithSearch = useCallback(
      (option: FlattedCheckCascaderItem) => {
        // 如果 titleRender 返回 `true`，则使用默认 title
        const title = titleRender ? titleRender(option) : true

        if (title !== true) {
          return title
        }
        console.log('inSearch', inSearch)

        if (!inSearch) return true

        const searchValue = inputProps.value

        if (typeof option.title !== 'string') {
          return null
        }

        let found = false

        return (
          <span className={cx(`title__text`, `title__text--cols`)}>
            {getNodeAncestors(option)
              .map((item) => {
                if (typeof item.title !== 'string') {
                  return null
                }

                if (found) {
                  return (
                    <span className={`title__text--col`} key={item.id}>
                      {item.title}
                    </span>
                  )
                }

                const index = item.title.indexOf(searchValue)
                if (index === -1) return null
                found = true

                const beforeStr = item.title.substr(0, index)
                const afterStr = item.title.substr(index + searchValue.length)

                console.log(index, beforeStr, afterStr)

                return (
                  <span className={`title__text--col`} key={item.id}>
                    {beforeStr}
                    <span className="title__text--matched" style={{ color: 'red' }}>
                      {searchValue}
                    </span>
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

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {searchable ? (
          <div className={`${prefixCls}-search`}>
            <Input
              appearance="underline"
              prefix={<SearchOutlined />}
              value={inputProps.value}
              onChange={inputProps.onChange}
            />
            {isEmpty ? <span className={`${prefixCls}-search__empty`}>{emptyContent}</span> : null}
          </div>
        ) : null}
        <CheckCascaderMenus
          {...{
            value,
            defaultValue,
            disabled,
            expandTrigger,
            changeOnSelect,
            checkCascaded,
            clearable,
            emptyContent,
            displayRender,
            onChange,
            onSelect,
          }}
          data={inSearch ? matchedNodes : flattedData}
          flatted={flatted || inSearch}
          titleRender={renderTitleWithSearch}
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
  onChange?: (values: React.ReactText[], checkedOptions: CheckCascaderItem[]) => void
  /**
   * 选项被点击时的回调
   */
  onSelect?: (selectedIds: React.ReactText[], item: CheckCascaderItem) => void
  /**
   * 次级菜单的展开方式
   */
  expandTrigger?: ExpandTrigger
  /**
   * 是否可搜索
   */
  searchable?: boolean
  /**
   * 是否有边框	boolean	true | false	true
   */
  appearance?: 'outlined'
  /**
   * 是否可清空	boolean	true | false	true
   */
  clearable?: boolean
  /**
   * 是否禁止使用	boolean	true | false	false
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
  titleRender?: (item: FlattedCheckCascaderItem) => React.ReactNode
  /**
   * 自定义选择后触发器所展示的内容
   */
  displayRender?: (value: React.ReactText[][]) => React.ReactNode
  /**
   * 支持 checkbox 级联（正反选）功能
   */
  checkCascaded?: boolean
  /**
   * 将 check 子项拍平展示
   */
  flatted?: boolean
  /**
   * 开启全量搜索，默认只对开启 checkable 的选项进行搜索
   */
  fullMatch?: boolean
}

if (__DEV__) {
  CheckCascaderPanel.displayName = 'CheckCascaderPanel'
}
