import React, { forwardRef, useCallback, useMemo, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { DataSourceFunc, FieldNames, TreeSelectDataItem, TreeSelectDataSource } from './types'
import { useToggle } from '@hi-ui/use-toggle'
import { PopperProps } from '@hi-ui/popper'
import { Tree, TreeNodeEventData } from '@hi-ui/tree'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { Picker, PickerProps } from '@hi-ui/picker'
import { cloneTree, flattenTree, getNodeAncestors, filterTree } from '@hi-ui/tree-utils'
import { isArray, isArrayNonEmpty, isFunction } from '@hi-ui/type-assertion'
import { useDataSource } from '@hi-ui/use-data-source'
import { uniqBy } from 'lodash'

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
      // clearable = false,
      // bordered = true,
      fieldNames = DEFAULT_FIELD_NAMES,
      showCheckedMode,
      // type,
      defaultExpandAll = false,
      expandedIds: expandedIdsProp,
      defaultExpandedIds = DEFAULT_EXPANDED_IDS,
      onExpand,
      defaultValue = '',
      value: valueProp,
      onChange,
      // displayRender,
      // placeholder,
      autoload,
      searchable: searchableProp,
      searchMode: searchModeProp,
      onLoadChildren,
      titleRender,
      filterOption,
      // emptyContent,
      // optionWidth,
      // overlayClassName,
      // popper,
      ...rest
    },
    ref
  ) => {
    // 帮助用户自动开启 searchable
    const searchMode = useMemo(() => {
      if (searchableProp === false) return ''

      if (dataSource) return 'dataSource'

      if (filterOption) return 'filterOption'

      if (searchModeProp === 'highlight' || searchModeProp === 'filter') return searchModeProp

      return ''
    }, [searchModeProp, searchableProp, dataSource, filterOption])

    const searchable = searchMode !== ''

    const [menuVisible, menuVisibleAction] = useToggle()

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
      return flattenTree(data, (node) => {
        node.id = getKeyFields(node.raw, 'id')
        // @ts-ignore
        node.title = getKeyFields(node.raw, 'title')
        return node
      })
    }, [data, getKeyFields])

    // TODO: 抽离展开hook
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
        if (selectedId) {
          tryChangeValue(selectedId, selectedNode)
          setSelectedItem(selectedNode)
        }
        // 关闭弹窗
        menuVisibleAction.off()
      },
      [menuVisibleAction, tryChangeValue]
    )

    const filterByCustom = isFunction(filterOption)

    // TODO: 抽离 useSearch
    const [searchValue, setSearchValue] = useState('')

    // 搜索时临时节点展开态
    const [expandedIdsInSearch, setExpandedIdsInSearch] = useState<React.ReactText[]>([])
    const [dataInSearch, setDataInSearch] = useState<any[]>(data)
    const [matchedCount, setMatchedCount] = useState(0)

    // ************************** 异步搜索 ************************* //

    const [selectedItem, setSelectedItem] = useState<TreeSelectDataItem | null>(null)

    const { loadRemoteData } = useDataSource({ dataSource, validate: isArray })

    const [status, setStatus] = useState('pending')
    const loading = status === 'loading'
    const hasError = status === 'rejected'

    const onAsyncSearch = useCallback(
      (keyword: string) => {
        setStatus('loading')
        loadRemoteData(keyword)
          .then((asyncData) => {
            setStatus('fulfilled')
            setDataInSearch(asyncData)
            setMatchedCount(asyncData.length)
          })
          .catch(() => {
            setStatus('rejected')
          })
      },
      [loadRemoteData]
    )

    const onSearch = useCallback(
      (keyword: string) => {
        if (!searchable) return

        setSearchValue(keyword)

        if (!keyword) return

        if (dataSource) {
          onAsyncSearch(keyword)
          return
        }
        // TODO: 是否过滤 disabled

        let matchedNodes
        let filteredNodeIds
        let showData

        // 自定义筛选
        if (filterByCustom) {
          matchedNodes = filterTree(data, (node) => filterOption(keyword, node))
          filteredNodeIds = flattedData.map((item) => {
            return item.id
          })

          // console.log(matchedNodes, filteredNodeIds)

          // filterOption 模式展开全部
          setDataInSearch(matchedNodes)
          setMatchedCount(matchedNodes.length)
          setExpandedIdsInSearch(Array.from(new Set(filteredNodeIds)))
          return
        }

        switch (searchMode) {
          case 'highlight':
            // 1. 展开匹配节点树
            // 2. 高亮匹配节点文本
            matchedNodes = getMatchedNodes(flattedData, keyword)
            filteredNodeIds = getFilteredIds(matchedNodes)
            setExpandedIdsInSearch(filteredNodeIds)
            setMatchedCount(matchedNodes.length)
            setDataInSearch(data)
            return
          case 'filter':
            // 1. 展开匹配节点树
            // 2. 高亮匹配节点文本
            // 3. 过滤掉（隐藏）不相干的兄弟和祖先节点
            matchedNodes = getMatchedNodes(flattedData, keyword)
            filteredNodeIds = getFilteredIds(matchedNodes)
            showData = getSearchedData(
              cloneTree(data),
              matchedNodes.map((v) => v.id),
              filteredNodeIds
            )
            setExpandedIdsInSearch(filteredNodeIds)
            setDataInSearch(showData)
            setMatchedCount(matchedNodes.length)
        }
      },
      [
        searchable,
        flattedData,
        searchMode,
        setExpandedIdsInSearch,
        filterOption,
        filterByCustom,
        data,
        dataSource,
        onAsyncSearch,
      ]
    )

    // 拦截 titleRender，自定义高亮展示
    const proxyTitleRender = useCallback(
      (node: TreeNodeEventData) => {
        if (titleRender) {
          const ret = titleRender(node)
          if (ret && ret !== true) return ret
        }

        // 本地搜索执行默认高亮规则
        const highlight = !!searchValue && (searchMode === 'highlight' || searchMode === 'filter')

        const ret = highlight ? renderTitleWithHighlight(node, searchValue) : true

        return ret
      },
      [titleRender, searchValue, searchMode]
    )

    const shouldUseSearch = !!searchValue && !hasError
    const treeProps = {
      data: shouldUseSearch ? dataInSearch : data,
      expandedIds: shouldUseSearch ? expandedIdsInSearch : expandedIds,
      onExpand: shouldUseSearch ? setExpandedIdsInSearch : tryChangeExpandedIds,
      titleRender: proxyTitleRender,
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
        onOpen={menuVisibleAction.on}
        onClose={menuVisibleAction.off}
        value={value}
        onChange={tryChangeValue}
        data={mergedData}
        searchable={searchable}
        onSearch={onSearch}
        showEmpty={matchedCount === 0}
        loading={loading}
      >
        {isArrayNonEmpty(treeProps.data) ? (
          <Tree
            className={`${prefixCls}__tree`}
            selectable
            selectedId={value}
            onSelect={onSelect}
            // TODO: 支持 fieldNames
            // 禁用时被选中的样式处理
            onLoadChildren={onLoadChildren}
            {...treeProps}
          />
        ) : null}
      </Picker>
    )
  }
)

export interface TreeSelectProps extends Omit<PickerProps, 'data' | 'onChange'> {
  /**
   * 展示数据
   */
  data?: TreeSelectDataItem[]
  /**
   * 设置 data 中 id, title, disabled, children 对应的 key (3.0 新增)	object	-	{ title: 'title', id: 'id',disabled:'disabled', children: 'children'}
   */
  fieldNames?: FieldNames
  /**
   * 数据回显模式	string
   * ALL: 所有被选中节点，不区分父子节点
   * PARENT: 当所有子节点被选中时将只保留父节点
   * CHILD: 仅显示子节点
   */
  showCheckedMode?: 'ALL' | 'PARENT' | 'CHILD'
  /**
   * 数据选择类型
   */
  type?: 'single' | 'multiple'
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
  titleRender?: (node: TreeNodeEventData) => React.ReactNode
  /**
   * 点击异步加载子项
   */
  onLoadChildren?: (node: TreeNodeEventData) => void | Promise<TreeSelectDataItem[] | void>
  /**
   * 从远端获取数据，初始时是否自动加载
   */
  autoload?: boolean
  /**
   * 异步加载数据
   */
  dataSource?: DataSourceFunc | TreeSelectDataSource | Promise<TreeSelectDataItem[]>
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
   * checkedIds | checkedId: 选中项 ID 集合 | ID
   * checkedNodes | checkedNode: 选中项数据项集合|数据项
   * currentNode: 当前操作节点
   */
  onChange?: (
    selectedIds: React.ReactText,
    changedItem: TreeSelectDataItem,
    currentNode: TreeSelectDataItem
  ) => void
  /**
   * 是否可清空
   */
  clearable?: boolean
  /**
   * 自定义控制 popper 行为
   */
  popper?: PopperProps
}

if (__DEV__) {
  TreeSelect.displayName = 'TreeSelect'
}

/**
 * 高亮节点的文本内容
 * TODO: 抽离 highlight 组件
 */
const renderTitleWithHighlight = (node: TreeNodeEventData, searchValue: string) => {
  if (typeof node.title !== 'string') {
    return
  }

  // 支持多个匹配高亮
  const index = node.title.indexOf(searchValue)
  if (index === -1) return node.title

  const beforeStr = node.title.substr(0, index)
  const afterStr = node.title.substr(index + searchValue?.length)

  return (
    <span>
      {beforeStr}
      <span className="title__text--matched">{searchValue}</span>
      {afterStr}
    </span>
  )
}

/**
 * 从 value 中 找到指定的 options（逐层查找）
 */
const getMatchedNodes = (
  flattedData: any[],
  searchValue: string,
  filter?: (option: any) => boolean
): any[] => {
  if (!searchValue) return []

  return flattedData.filter((node) => {
    if (typeof node.title !== 'string') {
      if (__DEV__) {
        console.info('WARNING: The `option.title` should be `string` when searchable is enabled.')
      }
      return false
    }

    if (filter && filter(node)) return false

    // 匹配策略：`String.include`
    return node.title.includes?.(searchValue)
  })
}

const getFilteredIds = (matchedNodes: any[]) => {
  const expandNodeIdsSet = new Set<React.ReactText>()

  matchedNodes.forEach((item) => {
    if (isArrayNonEmpty(item.children)) {
      expandNodeIdsSet.add(item.id)
    }
    const ancestors = getNodeAncestors(item)
    ancestors.forEach((ancestor) => {
      expandNodeIdsSet.add(ancestor.id)
    })
  })
  return Array.from(expandNodeIdsSet)
}

/**
 * 获取搜索高亮展示的数据
 */
const getSearchedData = (
  treeData: any[],
  matchedIds: React.ReactText[],
  filteredIds: React.ReactText[]
) => {
  for (let i = 0; i < treeData.length; ++i) {
    const node = treeData[i]
    if (matchedIds.includes(node.id)) {
      // do nothing
    } else if (filteredIds.includes(node.id)) {
      if (node.children) {
        getSearchedData(node.children, matchedIds, filteredIds)
      }
    } else {
      treeData.splice(i, 1)
      i = i - 1
    }
  }

  return treeData
}
