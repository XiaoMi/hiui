import React, { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { DownOutlined, UpOutlined } from '@hi-ui/icons'
import {
  CheckCascaderDataItem,
  CheckCascaderExpandTriggerEnum,
  CheckCascaderItemEventData,
  FlattedCheckCascaderDataItem,
} from './types'
import { useCache } from '@hi-ui/use-cache'
import { Picker, PickerHelper, PickerProps } from '@hi-ui/picker'
import { TagInputMock, TagInputMockProps } from '@hi-ui/tag-input'
import { CheckCascaderMenuList } from './CheckCascaderMenuList'
import {
  matchStrategy,
  useSearchMode,
  useTreeCustomSearch,
  useTreeUpMatchSearch,
} from '@hi-ui/use-search-mode'
import { flattenTreeData } from './utils'
import { getNodeAncestorsWithMe, getTopDownAncestors } from '@hi-ui/tree-utils'
import { useLatestCallback } from '@hi-ui/use-latest'
import { isArrayNonEmpty, isFunction, isUndef } from '@hi-ui/type-assertion'
import {
  HiBaseAppearanceEnum,
  HiBaseFieldNames,
  HiBaseSizeEnum,
  useLocaleContext,
} from '@hi-ui/core'

import { callAllFuncs } from '@hi-ui/func-utils'

const _prefix = getPrefixCls('check-cascader')
const NOOP_ARRAY = [] as []

/**
 * 多项级联选择器
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
      placeholder: placeholderProp,
      clearable,
      onClear,
      onSelect,
      expandTrigger,
      disabled = false,
      emptyContent,
      changeOnSelect,
      render: titleRender,
      displayRender,
      checkCascaded,
      searchPlaceholder,
      onLoadChildren,
      // picker
      appearance,
      invalid,
      // search
      filterOption,
      searchable: searchableProp,
      keyword: keywordProp,
      onSearch: onSearchProp,
      overlayClassName,
      type = 'tree',
      checkedMode,
      visible,
      onOpen,
      onClose,
      tagInputProps,
      size = 'md',
      prefix,
      suffix,
      renderExtraFooter,
      dropdownColumnRender,
      customRender,
      fieldNames,
      ...rest
    },
    ref
  ) => {
    const i18n = useLocaleContext()

    const pickerInnerRef = useRef<PickerHelper>(null)

    const placeholder = isUndef(placeholderProp)
      ? i18n.get('checkCascader.placeholder')
      : placeholderProp

    const flatted = type === 'flatted'

    const [menuVisible, menuVisibleAction] = useUncontrolledToggle({
      visible,
      disabled,
      onOpen,
      onClose,
    })

    const [cascaderData, setCascaderData] = useCache(data)

    const [flattedData, flattedDataMap] = useMemo(() => {
      const flattedData = flattenTreeData(cascaderData, fieldNames)
      const flattedDataMap = new Map(flattedData.map((node: any, index) => [node.id, node]))

      return [flattedData, flattedDataMap]
    }, [cascaderData, fieldNames])

    const [_value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)
    // 内部实现使用尾部 id
    const value = _value.map((path) => path[path.length - 1])

    const proxyOnChange = useLatestCallback(
      (value: React.ReactText[], item: any, shouldChecked: boolean) => {
        let dataItemsPaths = [] as FlattedCheckCascaderDataItem[]

        const itemsPaths = value.map((lastId) => {
          const item = flattedDataMap.get(lastId)

          if (item) {
            dataItemsPaths = getTopDownAncestors(item)
            return dataItemsPaths.map(({ id }) => id)
          }

          // 对于传入的数据未匹配到，保持不变吐出去
          const idPaths = _value.find((item) => item[item.length - 1] === lastId)
          const nextIdPaths = idPaths || [lastId]

          // 对于匹配不到的，将 title 设置为 id 构造一个数据项
          dataItemsPaths = dataItemsPaths.concat(
            nextIdPaths.map((id) => ({ id, title: id })) as FlattedCheckCascaderDataItem[]
          )

          return nextIdPaths
        })

        tryChangeValue(itemsPaths, item, dataItemsPaths)
      }
    )

    // ************************** 搜索 ************************* //
    // 无法做异步搜索，因为下拉菜单不能合并（因为树形数据，不知道是第几级）

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
      keyword: keywordProp,
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

    const shouldUseSearch = !!searchValue

    const selectProps = {
      data: shouldUseSearch ? stateInSearch.data : flattedData,
      titleRender: proxyTitleRender,
    }

    const cls = cx(prefixCls, className, `${prefixCls}--${menuVisible ? 'open' : 'closed'}`)

    const selectedItems = useMemo(() => {
      return value.map((selectedId) => {
        return flattedDataMap.get(selectedId)
      })
    }, [flattedDataMap, value])

    useEffect(() => {
      if (menuVisible) {
        // 数据改变时更新弹窗显示位置，避免弹窗内容被遮挡
        pickerInnerRef.current?.update()
      }
    }, [menuVisible, selectProps.data])

    return (
      <Picker
        ref={ref}
        innerRef={pickerInnerRef}
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
        scrollable={false}
        footer={isFunction(renderExtraFooter) && renderExtraFooter()}
        keyword={keywordProp}
        onSearch={callAllFuncs(onSearchProp, onSearch)}
        trigger={
          customRender ? (
            typeof customRender === 'function' ? (
              customRender(selectedItems)
            ) : (
              customRender
            )
          ) : (
            <TagInputMock
              {...tagInputProps}
              size={size}
              clearable={clearable}
              onClear={onClear}
              placeholder={placeholder}
              // @ts-ignore
              displayRender={displayRender}
              prefix={prefix}
              suffix={[menuVisible ? <UpOutlined /> : <DownOutlined />, suffix]}
              focused={menuVisible}
              appearance={appearance}
              value={value}
              // @ts-ignore
              onChange={proxyOnChange}
              data={flattedData}
              invalid={invalid}
              // onExpand={() => {
              //   // setViewSelected(true)
              //   menuVisibleAction.on()
              // }}
            />
          )
        }
      >
        {isArrayNonEmpty(selectProps.data) ? (
          <CheckCascaderMenuList
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
            originalFlattedData={flattedData}
            data={cascaderData}
            onChangeData={setCascaderData}
            checkedMode={checkedMode}
            dropdownColumnRender={dropdownColumnRender}
          />
        ) : null}
      </Picker>
    )
  }
)

export interface CheckCascaderProps extends Omit<PickerProps, 'trigger' | 'scrollable'> {
  /**
   * 设置选择项数据源
   */
  data: CheckCascaderDataItem[]
  /**
   * 设置 data 中字段对应的 key
   */
  fieldNames?: HiBaseFieldNames
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
   */
  onChange?: (
    values: React.ReactText[][],
    targetOption?: CheckCascaderItemEventData,
    optionPaths?: FlattedCheckCascaderDataItem[]
  ) => void
  /**
   * 选项被点击时的回调。暂不对外暴露
   * @private
   */
  onSelect?: (selectedId: React.ReactText, selectedOption: CheckCascaderItemEventData) => void
  /**
   * 次级菜单的展开方式
   */
  expandTrigger?: CheckCascaderExpandTriggerEnum
  /**
   * 是否可搜索（仅在 title 为字符串时支持）
   */
  searchable?: boolean
  /**
   * 是否可清空
   */
  clearable?: boolean
  /**
   * 点击关闭按钮时触发
   */
  onClear?: () => void
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
  displayRender?: (checkedOption: FlattedCheckCascaderDataItem) => React.ReactNode
  /**
   * 支持 checkbox 级联（正反选）功能
   */
  checkCascaded?: boolean
  /**
   * 将 check 子项拍平展示。暂不对外暴露
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
  ) => Promise<CheckCascaderDataItem[] | void> | void
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
  /**
   * 多选数据交互时回填、回显模式
   * PARENT: 当所有子节点被选中时将只保留父节点
   * ALL: 所有被选中节点，不区分父子节点（不支持异步数据加载勾选checkbox）
   * CHILD: 仅显示子节点（不支持异步数据加载勾选checkbox）
   * SEPARATE：父子完全独立受控
   */
  checkedMode?: 'PARENT' | 'CHILD' | 'ALL' | 'SEPARATE'
  /**
   * TagInput 参数设置
   */
  tagInputProps?: TagInputMockProps
  /**
   * 设置尺寸
   */
  size?: HiBaseSizeEnum
  /**
   * 选择框前置内容
   */
  prefix?: React.ReactNode
  /**
   * 选择框后置内容
   */
  suffix?: React.ReactNode
  /**
   * 自定义下拉菜单底部渲染
   */
  renderExtraFooter?: () => React.ReactNode
  /**
   * 自定义下拉菜单每列渲染
   */
  dropdownColumnRender?: (menu: React.ReactElement, level: number) => React.ReactNode
  /**
   * 自定义触发器
   */
  customRender?:
    | React.ReactNode
    | ((selectItems: (FlattedCheckCascaderDataItem | undefined)[]) => React.ReactNode)
}

if (__DEV__) {
  CheckCascader.displayName = 'CheckCascader'
}
