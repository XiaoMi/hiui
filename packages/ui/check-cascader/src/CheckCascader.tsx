import React, { forwardRef, useCallback, useMemo, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useToggle } from '@hi-ui/use-toggle'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { DownOutlined, UpOutlined } from '@hi-ui/icons'
import { PopperJS } from '@hi-ui/popper'
import {
  CheckCascaderItem,
  ExpandTrigger,
  CheckCascaderItemEventData,
  FlattedCheckCascaderItem,
} from './types'
import { matchStrategy, useCache } from './hooks'
import { Picker, PickerProps } from '@hi-ui/picker'
import { TagInputMock } from '@hi-ui/tag-input'
import { uniqBy } from 'lodash'
import { CheckCascaderMenus } from './CheckCascaderMenus'
import {
  useAsyncSearch,
  useFilterSearch,
  useSearchMode,
  useTreeCustomSearch,
  useTreeUpMatchSearch,
} from '@hi-ui/use-search-mode'
import { flattenTreeData } from './utils'
import { getNodeAncestors } from '@hi-ui/tree-utils'
import { useLatestCallback } from '@hi-ui/use-latest'
import { UseDataSource } from '@hi-ui/use-data-source'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'

const _prefix = getPrefixCls('check-cascader')
const NOOP_ARRAY = [] as []

/**
 * TODO: What is CheckCascader
 */
export const CheckCascader = forwardRef<HTMLDivElement | null, CheckCascaderProps>(
  (
    {
      prefixCls = _prefix,
      className,
      defaultValue = NOOP_ARRAY,
      value: valueProp,
      onChange,
      data = NOOP_ARRAY,
      placeholder,
      clearable,
      onSelect,
      expandTrigger,
      disabled,
      emptyContent,
      changeOnSelect,
      titleRender,
      displayRender,
      checkCascaded,
      flatted,
      upMatch,
      searchPlaceholder,
      onLoadChildren,
      placement,
      wrap,
      // picker
      appearance,
      invalid,
      // search
      dataSource,
      filterOption,
      searchable: searchableProp,
      overlayClassName,
      ...rest
    },
    ref
  ) => {
    const [menuVisible, menuVisibleAction] = useToggle()

    const [cascaderData, setCascaderData] = useCache(data)

    const flattedData = useMemo(() => flattenTreeData(cascaderData), [cascaderData])

    const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)

    const proxyOnChange = useLatestCallback(
      (value: React.ReactText[], item: any, shouldChecked: boolean) => {
        tryChangeValue(value, item, shouldChecked)
        console.log('proxyOnChange', value)

        // 包括所有全选的数据，包括全选
        if (shouldChecked) {
          // TODO：as useCheckList
          setSelectedItems((prev) => {
            return [...prev, item]
          })
        }
      }
    )

    // ************************** 异步搜索 ************************* //

    // TODO: 支持对 Item 传入 状态
    const { loading, hasError, ...dataSourceStrategy } = useAsyncSearch({ dataSource })
    const customSearchStrategy = useTreeCustomSearch({ data: flattedData, filterOption })
    const filterSearchStrategy = useFilterSearch({
      data: flattedData,
      flattedData: flattedData,
      searchMode: searchableProp && !upMatch ? 'filter' : undefined,
      exclude: (node: any) => !node.checkable,
    })

    const upMatchSearchStrategy = useTreeUpMatchSearch({
      data: cascaderData,
      flattedData: flattedData,
      enabled: upMatch,
      exclude: (node: any) => !node.checkable,
    })

    const {
      state: stateInSearch,
      searchable,
      searchMode,
      onSearch,
      keyword: searchValue,
    } = useSearchMode({
      searchable: searchableProp,
      strategies: [
        dataSourceStrategy,
        customSearchStrategy,
        filterSearchStrategy,
        upMatchSearchStrategy,
      ],
    })

    // 拦截 titleRender，自定义高亮展示
    const proxyTitleRender = useCallback(
      (node: any) => {
        if (titleRender) {
          const ret = titleRender(node)
          if (ret && ret !== true) return ret
        }

        // 本地搜索执行默认高亮规则
        const highlight = !!searchValue && (searchMode === 'upMatch' || searchMode === 'filter')

        let found = false

        const ret = highlight ? (
          <span className={cx(`title__text`, `title__text--cols`)}>
            {getNodeAncestors(node)
              .map((item) => {
                const { title, id } = item
                const raw = (
                  <span className="title__text--col" key={id}>
                    {title}
                  </span>
                )

                if (typeof title !== 'string') return raw
                if (found) return raw

                const index = matchStrategy(title, searchValue)
                if (index === -1) return raw

                found = true

                const resultLength = searchValue.length

                const beforeStr = title.substr(0, index)
                const resultStr = title.substr(index, searchValue.length)
                const afterStr = title.substr(index + resultLength)

                return (
                  <span className={`title__text--col`} key={id}>
                    {beforeStr}
                    <span className="title__text--matched">{resultStr}</span>
                    {afterStr}
                  </span>
                )
              })
              .reverse()}
          </span>
        ) : (
          true
        )

        return ret
      },
      [titleRender, searchValue, searchMode]
    )

    // 搜索时临时选中缓存数据
    const [selectedItems, setSelectedItems] = useState<any[]>([])

    const shouldUseSearch = !!searchValue && !hasError

    const selectProps = {
      data: shouldUseSearch ? stateInSearch.data : flattedData,
      titleRender: proxyTitleRender,
    }

    // 下拉菜单不能合并（因为树形数据，不知道是第几级）
    const mergedData: any[] = useMemo(() => {
      const nextData = selectedItems.concat(flattedData as any[])
      return uniqBy(nextData, 'id')
    }, [selectedItems, flattedData])

    const cls = cx(prefixCls, className, `${prefixCls}--${menuVisible ? 'open' : 'closed'}`)

    return (
      <Picker
        ref={ref}
        className={cls}
        overlayClassName={cx(`${prefixCls}__popper`, overlayClassName)}
        {...rest}
        // 这种展现形式宽度是不固定的，关掉宽度匹配策略
        popper={{ matchWidth: false, ...rest.popper }}
        visible={menuVisible}
        onOpen={() => {
          // setViewSelected(false)
          menuVisibleAction.on()
        }}
        disabled={disabled}
        onClose={menuVisibleAction.off}
        searchable={searchable}
        onSearch={onSearch}
        loading={loading}
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
            onChange={proxyOnChange}
            data={mergedData}
            invalid={invalid}
            onExpand={() => {
              // setViewSelected(true)
              menuVisibleAction.on()
            }}
          />
        }
      >
        {isArrayNonEmpty(selectProps.data) ? (
          <CheckCascaderMenus
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            // @ts-ignore
            onChange={proxyOnChange}
            expandTrigger={expandTrigger}
            changeOnSelect={changeOnSelect}
            checkCascaded={checkCascaded}
            onSelect={onSelect}
            onLoadChildren={onLoadChildren}
            titleRender={proxyTitleRender}
            flatted={flatted || !!searchValue}
            // @ts-ignore
            flattedData={selectProps.data}
            data={cascaderData}
            onChangeData={setCascaderData}
          />
        ) : null}
      </Picker>
    )
  }
)

export interface CheckCascaderProps extends Omit<PickerProps, 'trigger'> {
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
   * TODO: 是否有这样的需求：暴露操作的原始数据对象？包括 点击 checkbox、点击 tag 删除按钮、点击清空按钮
   */
  onChange?: (values: React.ReactText[]) => void
  /**
   * 选项被点击时的回调
   */
  onSelect?: (selectedId: React.ReactText, selectedOption: CheckCascaderItemEventData) => void
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
   * 自定义选择后触发器所展示的内容
   */
  displayRender?: (checkedOption: FlattedCheckCascaderItem) => React.ReactNode
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
   * 触发器输入框占位符
   */
  placeholder?: string
  /**
   * 搜索输入框占位符
   */
  searchPlaceholder?: string
  /**
   * 异步请求更新数据
   */
  onLoadChildren?: (item: CheckCascaderItemEventData) => Promise<CheckCascaderItem[] | void> | void
  /**
   * 是否单行展示，超出 +1
   */
  wrap?: boolean
  /**
   * 相对 reference 的位置
   */
  placement?: PopperJS.Placement
  /**
   * 设置展现形式
   */
  appearance?: 'outline' | 'unset' | 'filled'
  /**
   * 节点搜索模式
   */
  searchMode?: 'highlight' | 'filter' | 'upMatch'
  /**
   * 自定义搜索过滤器，仅在 searchable 为 true 时有效
   * 第一个参数为输入的关键字，
   * 第二个为数据项，返回值为 true 时将出现在结果项
   */
  filterOption?: (keyword: string, item: any) => boolean
  /**
   * 异步加载数据
   */
  dataSource?: UseDataSource<any>
}

if (__DEV__) {
  CheckCascader.displayName = 'CheckCascader'
}
