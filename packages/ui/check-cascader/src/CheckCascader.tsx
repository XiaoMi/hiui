import React, { forwardRef, useCallback, useMemo, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useToggle } from '@hi-ui/use-toggle'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { DownOutlined, UpOutlined } from '@hi-ui/icons'
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
import { useSearchMode, useTreeCustomSearch, useTreeUpMatchSearch } from '@hi-ui/use-search-mode'
import { flattenTreeData } from './utils'
import { getNodeAncestorsWithMe, getTopDownAncestors } from '@hi-ui/tree-utils'
import { useLatestCallback, useLatestRef } from '@hi-ui/use-latest'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'
import { HiBaseAppearanceEnum } from '@hi-ui/core'

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
      render: titleRender,
      displayRender,
      checkCascaded,
      searchPlaceholder,
      onLoadChildren,
      wrap,
      // picker
      appearance,
      invalid,
      // search
      filterOption,
      searchable: searchableProp,
      overlayClassName,
      type = 'tree',
      ...rest
    },
    ref
  ) => {
    const flatted = type === 'flatted'

    const [menuVisible, menuVisibleAction] = useToggle()

    const [cascaderData, setCascaderData] = useCache(data)

    const flattedData = useMemo(() => flattenTreeData(cascaderData), [cascaderData])

    const [_value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)
    const value = _value.map((path) => path[path.length - 1])

    const flattedDataLatestRef = useLatestRef(flattedData)
    const proxyOnChange = useLatestCallback(
      (value: React.ReactText[], item: any, shouldChecked: boolean) => {
        const flattedItems = flattedDataLatestRef.current
        const itemsPaths = flattedItems
          .filter((item) => value.includes(item.id))
          .map((item) => getTopDownAncestors(item).map(({ id }) => id))

        // TODO: 找到所有 id 的祖先节点路径
        tryChangeValue(itemsPaths)

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

    const customSearchStrategy = useTreeCustomSearch({ data: flattedData, filterOption })

    const upMatchSearchStrategy = useTreeUpMatchSearch({
      data: cascaderData,
      flattedData: flattedData,
      enabled: searchableProp,
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
      strategies: [customSearchStrategy, upMatchSearchStrategy],
    })

    // 拦截 titleRender，自定义高亮展示
    const proxyTitleRender = useCallback(
      (node: any) => {
        if (titleRender) {
          const ret = titleRender(node)
          if (ret && ret !== true) return ret
        }

        // 本地搜索执行默认高亮规则
        const highlight = !!searchValue && searchMode === 'upMatch'

        let found = false

        const ret = highlight ? (
          <span className={cx(`title__text`, `title__text--cols`)}>
            {getNodeAncestorsWithMe(node)
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

    const shouldUseSearch = !!searchValue

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
        overlay={{ matchWidth: false, ...rest.overlay }}
        visible={menuVisible}
        onOpen={() => {
          // setViewSelected(false)
          menuVisibleAction.on()
        }}
        disabled={disabled}
        onClose={menuVisibleAction.off}
        searchable={searchable}
        onSearch={onSearch}
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
   * 设置选择项数据源
   */
  data: CheckCascaderItem[]
  /**
   * 设置当前多选值
   */
  value?: React.ReactText[][]
  /**
   * 设置当前多选值默认值
   */
  defaultValue?: React.ReactText[][]
  /**
   * 多选值改变时的回调
   * TODO: 是否有这样的需求：暴露操作的原始数据对象？包括 点击 checkbox、点击 tag 删除按钮、点击清空按钮
   */
  onChange?: (values: React.ReactText[][]) => void
  /**
   * 选项被点击时的回调
   * @private
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
  render?: (item: CheckCascaderItemEventData) => React.ReactNode
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
   * @private
   */
  type?: 'flatted' | 'tree'
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
  onLoadChildren?: (
    item: CheckCascaderItemEventData,
    idPaths: React.ReactText[]
  ) => Promise<CheckCascaderItem[] | void> | void
  /**
   * 是否单行展示，超出 +1
   * @private
   */
  wrap?: boolean
  /**
   * 设置展现形式
   */
  appearance?: HiBaseAppearanceEnum
  /**
   * 自定义搜索过滤器，仅在 searchable 为 true 时有效
   * 第一个参数为输入的关键字，
   * 第二个为数据项，返回值为 true 时将出现在结果项
   */
  filterOption?: (keyword: string, item: any) => boolean
}

if (__DEV__) {
  CheckCascader.displayName = 'CheckCascader'
}
