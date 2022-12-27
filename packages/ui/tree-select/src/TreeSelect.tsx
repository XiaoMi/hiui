import React, { forwardRef, useCallback, useMemo, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TreeSelectDataItem } from './types'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { FlattedTreeNodeData, Tree, TreeNodeEventData } from '@hi-ui/tree'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { Picker, PickerProps } from '@hi-ui/picker'
import { baseFlattenTree } from '@hi-ui/tree-utils'
import { isArrayNonEmpty, isUndef } from '@hi-ui/type-assertion'
import { uniqBy } from '@hi-ui/array-utils'
import { Highlighter } from '@hi-ui/highlighter'
import { MockInput } from '@hi-ui/input'
import { DownOutlined, UpOutlined } from '@hi-ui/icons'
import { HiBaseAppearanceEnum, useLocaleContext } from '@hi-ui/core'

import { callAllFuncs } from '@hi-ui/func-utils'
import { UseDataSource } from '@hi-ui/use-data-source'
import {
  useAsyncSearch,
  useFilterSearch,
  useHighlightSearch,
  useSearchMode,
  useTreeCustomSearch,
} from '@hi-ui/use-search-mode'

const TREE_SELECT_PREFIX = getPrefixCls('tree-select')
const DEFAULT_DATA = [] as []
// const DEFAULT_VALUE = [] as []
const DEFAULT_FIELD_NAMES = {} as any
const DEFAULT_EXPANDED_IDS = [] as []

/**
 * TODO: What is TreeSelect
 */
export const TreeSelect = forwardRef<HTMLDivElement | null, TreeSelectProps>(
  (
    {
      prefixCls = TREE_SELECT_PREFIX,
      role = 'tree-select',
      className,
      data = DEFAULT_DATA,
      dataSource,
      disabled = false,
      visible,
      onOpen,
      onClose,
      // clearable = false,
      // bordered = true,
      fieldNames = DEFAULT_FIELD_NAMES,
      defaultExpandAll = false,
      expandedIds: expandedIdsProp,
      defaultExpandedIds = DEFAULT_EXPANDED_IDS,
      onExpand,
      defaultValue = '',
      value: valueProp,
      onChange,
      searchable: searchableProp,
      searchMode: searchModeProp,
      onLoadChildren,
      render: titleRender,
      filterOption,
      onSearch: onSearchProp,
      // ********* popper ********* //
      // optionWidth,
      // overlayClassName,
      // popper,
      // ********* picker ********* //
      clearable,
      invalid,
      displayRender: displayRenderProp,
      placeholder: placeholderProp,
      appearance,
      virtual,
      itemHeight,
      height,
      ...rest
    },
    ref
  ) => {
    const i18n = useLocaleContext()

    const placeholder = isUndef(placeholderProp)
      ? i18n.get('treeSelect.placeholder')
      : placeholderProp

    const [menuVisible, menuVisibleAction] = useUncontrolledToggle({
      visible,
      disabled,
      onOpen,
      onClose,
    })

    /**
     * 转换对象
     */
    const getKeyFields = useCallback(
      (node: any, key: string) => {
        return node[fieldNames[key] || key]
      },
      [fieldNames]
    )

    const flattedData = useMemo(() => {
      return baseFlattenTree<TreeSelectDataItem>({
        tree: data,
        childrenFieldName: (node) => getKeyFields(node, 'children'),
        transform: (node) => {
          const flattedNode = node as FlattedTreeNodeData
          const raw = node.raw

          flattedNode.id = getKeyFields(raw, 'id')
          flattedNode.title = getKeyFields(raw, 'title')
          flattedNode.disabled = getKeyFields(raw, 'disabled') ?? false
          flattedNode.isLeaf = getKeyFields(raw, 'isLeaf') ?? false

          return flattedNode
        },
      }) as FlattedTreeNodeData[]
    }, [data, getKeyFields])

    // TODO: 抽离展开hook
    // TODO: onLoadChildren 和 defaultExpandAll 共存时
    const [expandedIds, tryChangeExpandedIds] = useUncontrolledState(
      function getDefaultExpandedIds() {
        // 开启默认展开全部
        if (defaultExpandAll) {
          return flattedData.map((node) => node.id)
        }
        return defaultExpandedIds
      },
      expandedIdsProp,
      onExpand
    )

    const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)

    const onSelect = useCallback(
      (selectedId: React.ReactText | null, selectedNode: TreeNodeEventData | null) => {
        // 关闭反选功能
        if (selectedId) {
          tryChangeValue(selectedId, selectedNode)
          setSelectedItem(selectedNode)
        }
        // 关闭弹窗
        menuVisibleAction.off()
      },
      [menuVisibleAction, tryChangeValue]
    )

    // 搜索时临时选中缓存数据
    const [selectedItem, setSelectedItem] = useState<TreeSelectDataItem | null>(null)

    // ************************** 异步搜索 ************************* //

    // const { loading, hasError, loadRemoteData } = useDataSource({ dataSource, validate: isArray })

    const { loading, hasError, ...dataSourceStrategy } = useAsyncSearch({ dataSource })
    const customSearchStrategy = useTreeCustomSearch({ data, filterOption })
    const filterSearchStrategy = useFilterSearch({
      enabled: searchModeProp === 'filter',
      data,
      flattedData,
      fieldNames,
    })
    const highlightSearchStrategy = useHighlightSearch({
      data,
      flattedData,
      searchMode: searchModeProp,
    })

    const {
      state: stateInSearch,
      setStateInSearch,
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
        highlightSearchStrategy,
      ],
    })

    // 拦截 titleRender，自定义高亮展示
    const proxyTitleRender = useCallback(
      (node: TreeNodeEventData) => {
        if (titleRender) {
          const ret = titleRender(node)
          if (ret && ret !== true) return ret
        }

        // 本地搜索执行默认高亮规则
        const highlight = !!searchValue && (searchMode === 'highlight' || searchMode === 'filter')

        const ret = highlight ? <Highlighter keyword={searchValue}>{node.title}</Highlighter> : true

        return ret
      },
      [titleRender, searchValue, searchMode]
    )

    const shouldUseSearch = !!searchValue && !hasError

    const treeProps = {
      data: shouldUseSearch ? stateInSearch.data : data,
      expandedIds: shouldUseSearch ? stateInSearch.expandedIds : expandedIds,
      onExpand: shouldUseSearch
        ? (ids: any) => setStateInSearch((prev: any) => ({ ...prev, expandedIds: ids }))
        : tryChangeExpandedIds,
      render: proxyTitleRender,
    }

    // 下拉菜单不能合并（因为树形数据，不知道是第几级）
    const mergedData: any[] = useMemo(() => {
      if (selectedItem) {
        const nextData = [selectedItem].concat(flattedData as any[])
        return uniqBy(nextData, 'id')
      }

      return flattedData
    }, [selectedItem, flattedData])

    const cls = cx(prefixCls, className)

    return (
      <Picker
        ref={ref}
        className={cls}
        {...rest}
        visible={menuVisible}
        disabled={disabled}
        onOpen={menuVisibleAction.on}
        onClose={menuVisibleAction.off}
        // value={value}
        // onChange={tryChangeValue}
        // data={mergedData}
        searchable={searchable}
        onSearch={callAllFuncs(onSearchProp, onSearch)}
        loading={rest.loading !== undefined ? rest.loading : loading}
        trigger={
          <MockInput
            // disabled={disabled}
            clearable={clearable}
            placeholder={placeholder}
            displayRender={displayRenderProp}
            suffix={menuVisible ? <UpOutlined /> : <DownOutlined />}
            focused={menuVisible}
            value={value}
            onChange={tryChangeValue}
            data={mergedData}
            // @ts-ignore
            invalid={invalid}
            appearance={appearance}
          />
        }
      >
        {isArrayNonEmpty(treeProps.data) ? (
          <Tree
            className={`${prefixCls}__tree`}
            selectable
            selectedId={value}
            onSelect={onSelect}
            fieldNames={fieldNames}
            // onLoadChildren 缓存数据
            // @ts-ignore
            onLoadChildren={onLoadChildren}
            virtual={virtual}
            itemHeight={itemHeight}
            height={height}
            {...treeProps}
          />
        ) : null}
      </Picker>
    )
  }
)

export interface TreeSelectProps
  extends Omit<PickerProps, 'data' | 'onChange' | 'trigger' | 'scrollable'> {
  /**
   * 展示数据
   */
  data?: TreeSelectDataItem[]
  /**
   * 设置 data 中 id, title, disabled, children 对应的 key (3.0 新增)	object	-	{ title: 'title', id: 'id',disabled:'disabled', children: 'children'}
   */
  fieldNames?: Record<string, string>
  /**
   * 是否有边框
   */
  bordered?: boolean
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否默认展开所有树节点
   */
  defaultExpandAll?: boolean
  /**
   * 展开的节点（受控）
   */
  expandedIds?: React.ReactText[]
  /**
   * 默认展开的节点（非受控）
   */
  defaultExpandedIds?: React.ReactText[]
  /**
   * 节点被点击(展开/收起)时触发
   */
  onExpand?: () => void
  /**
   * 默认选中项 （非受控）
   */
  defaultValue?: React.ReactText
  /**
   * 默认选中项 （受控）
   */
  value?: React.ReactText
  /**
   * 自定义渲染 Input 中展示内容
   */
  displayRender?: (item: TreeSelectDataItem) => React.ReactNode
  /**
   * 输入框占位	string	-	请选择
   */
  placeholder?: string
  /**
   * 节点搜索模式，仅在mode=normal模式下生效
   */
  searchMode?: 'highlight' | 'filter'
  /**
   * 自定义搜索过滤器，仅在 searchable 为 true 时有效
   * 第一个参数为输入的关键字，
   * 第二个为数据项，返回值为 true 时将出现在结果项
   */
  filterOption?: (keyword: string, item: TreeSelectDataItem) => boolean
  /**
   * 自定义渲染节点的 title 内容
   */
  render?: (node: TreeNodeEventData) => React.ReactNode
  /**
   * 点击异步加载子项
   */
  onLoadChildren?: (node: TreeNodeEventData) => void | Promise<TreeSelectDataItem[] | void>
  /**
   * 异步加载数据。暂不对外暴露
   * @private
   */
  dataSource?: UseDataSource<TreeSelectDataItem[]>
  /**
   * 没有选项时的提示
   */
  emptyContent?: React.ReactNode
  /**
   * 自定义下拉选项宽度
   */
  optionWidth?: number
  /**
   * 下拉根元素的类名称 (3.0 新增)
   */
  overlayClassName?: string
  /**
   * 选中时触发
   * selectedId : 选中项 ID
   * selectedItem: 选中项数据项
   */
  onChange?: (selectedId: React.ReactText, selectedItem: TreeSelectDataItem) => void
  /**
   * 是否可清空
   */
  clearable?: boolean
  /**
   * 设置展现形式
   */
  appearance?: HiBaseAppearanceEnum
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
}

if (__DEV__) {
  TreeSelect.displayName = 'TreeSelect'
}
