import React, { forwardRef, useCallback, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import {
  CheckTreeSelectDataItem,
  FlattedCheckTreeSelectDataItem,
  CheckTreeSelectItemEventData,
  CheckTreeSelectAppearanceEnum,
} from './types'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { FlattedTreeNodeData, Tree } from '@hi-ui/tree'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { Picker, PickerProps } from '@hi-ui/picker'
import { baseFlattenTree } from '@hi-ui/tree-utils'
import { isArrayNonEmpty, isUndef } from '@hi-ui/type-assertion'
import { uniqBy } from '@hi-ui/array-utils'
import { Highlighter } from '@hi-ui/highlighter'
import { TagInputMock } from '@hi-ui/tag-input'
import { UpOutlined, DownOutlined } from '@hi-ui/icons'
import { useLocaleContext } from '@hi-ui/core'
import { callAllFuncs } from '@hi-ui/func-utils'
// import { UseDataSource } from '@hi-ui/use-data-source'
import {
  useAsyncSearch,
  useFilterSearch,
  useHighlightSearch,
  useSearchMode,
  useTreeCustomSearch,
} from '@hi-ui/use-search-mode'
import { useCheck } from './hooks/use-check'

const TREE_SELECT_PREFIX = getPrefixCls('check-tree-select')
const DEFAULT_DATA = [] as []
const DEFAULT_VALUE = [] as []
const DEFAULT_FIELD_NAMES = {} as any
const DEFAULT_EXPANDED_IDS = [] as []

/**
 * TODO: What is CheckTreeSelect
 */
export const CheckTreeSelect = forwardRef<HTMLDivElement | null, CheckTreeSelectProps>(
  (
    {
      prefixCls = TREE_SELECT_PREFIX,
      role = 'check-tree-select',
      className,
      data = DEFAULT_DATA,
      // @ts-ignore
      dataSource,
      disabled = false,
      visible,
      onOpen,
      onClose,
      // clearable = false,
      // bordered = true,
      fieldNames = DEFAULT_FIELD_NAMES,
      checkedMode = 'ALL',
      // type,
      defaultExpandAll = false,
      expandedIds: expandedIdsProp,
      defaultExpandedIds = DEFAULT_EXPANDED_IDS,
      onExpand,
      defaultValue = DEFAULT_VALUE,
      value: valueProp,
      onChange,
      // autoload,
      searchable: searchableProp,
      searchMode: searchModeProp,
      onLoadChildren,
      render: titleRender,
      filterOption,
      onSearch: onSearchProp,
      // emptyContent,
      // ********* popper ********* //
      // optionWidth,
      // overlayClassName,
      // popper,
      // ********* picker ********* //
      clearable,
      invalid,
      displayRender,
      placeholder: placeholderProp,
      appearance,
      // searchPlaceholder,
      virtual,
      itemHeight,
      height,
      ...rest
    },
    ref
  ) => {
    const i18n = useLocaleContext()

    const placeholder = isUndef(placeholderProp)
      ? i18n.get('checkTreeSelect.placeholder')
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
      return baseFlattenTree({
        tree: data,
        childrenFieldName: (node) => getKeyFields(node, 'children'),
        transform: (node) => {
          const flattedNode: FlattedCheckTreeSelectDataItem = node as FlattedCheckTreeSelectDataItem
          const raw = node.raw

          flattedNode.id = getKeyFields(raw, 'id')
          flattedNode.title = getKeyFields(raw, 'title')
          flattedNode.disabled = getKeyFields(raw, 'disabled') ?? false
          flattedNode.isLeaf = getKeyFields(raw, 'isLeaf') ?? false

          return flattedNode
        },
      }) as FlattedCheckTreeSelectDataItem[]
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

    const [value, tryChangeValue, onNodeCheck, checkedNodes, parsedCheckedIds] = useCheck(
      checkedMode,
      disabled,
      flattedData,
      defaultValue,
      valueProp,
      onChange
    )

    const onCheck = useCallback(
      (
        checkedIds: React.ReactText[],
        option: {
          checkedNodes: CheckTreeSelectDataItem[]
          semiCheckedIds: React.ReactText[]
          targetNode: CheckTreeSelectItemEventData
          checked: boolean
        }
      ) => {
        const { targetNode, checked } = option
        onNodeCheck(targetNode, checked)
      },
      [onNodeCheck]
    )

    const onValueChange = useCallback(
      (values: React.ReactText[], targetItem: any[], shouldChecked: boolean) => {
        // 清空
        if (values.length === 0) {
          tryChangeValue([], null, shouldChecked, [])
        } else {
          // 操作单个
          onNodeCheck(targetItem[0], shouldChecked)
        }
      },
      [tryChangeValue, onNodeCheck]
    )

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
      (node: CheckTreeSelectItemEventData) => {
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
      const nextData = checkedNodes.concat(flattedData as any[])
      return uniqBy(nextData, 'id')
    }, [checkedNodes, flattedData])

    const cls = cx(prefixCls, className)

    // 过滤掉未选中的数据
    // const tagList = useMemo(() => {
    //   // @ts-ignore
    //   const [semiCheckedIds] = getSemiCheckedIdsWithSet(flattedData, (id) => value.includes(id))

    //   const ids = Array.from(new Set([...semiCheckedIds, ...value]))

    //   return flattedData.filter((item) => ids.includes(item.id))
    // }, [value, flattedData])

    return (
      <Picker
        ref={ref}
        className={cls}
        {...rest}
        visible={menuVisible}
        onOpen={() => {
          // setViewSelected(false)
          menuVisibleAction.on()
        }}
        disabled={disabled}
        onClose={menuVisibleAction.off}
        // value={value}
        // onChange={tryChangeValue}
        // data={mergedData}
        searchable={searchable}
        onSearch={callAllFuncs(onSearchProp, onSearch)}
        loading={rest.loading !== undefined ? rest.loading : loading}
        trigger={
          <TagInputMock
            // ref={targetElementRef}
            // onClick={openMenu}
            // disabled={disabled}
            clearable={clearable}
            placeholder={placeholder}
            // @ts-ignore
            displayRender={displayRender}
            suffix={menuVisible ? <UpOutlined /> : <DownOutlined />}
            focused={menuVisible}
            appearance={appearance}
            value={value}
            onChange={onValueChange}
            data={mergedData}
            // @ts-ignore
            invalid={invalid}
            // onExpand={() => {
            //   // setViewSelected(true)
            //   menuVisibleAction.on()
            // }}
          />
        }
      >
        {isArrayNonEmpty(treeProps.data) ? (
          // 只做渲染，不做逻辑处理（比如搜索过滤后，check操作的是对过滤后的data操作，这是不符合预期的）
          <Tree
            className={`${prefixCls}__tree`}
            selectable={false}
            checkable
            checkOnSelect
            checkedMode={checkedMode === 'SEPARATE' ? 'SEPARATE' : 'ALL'}
            checkedIds={parsedCheckedIds}
            onCheck={onCheck}
            // @ts-ignore
            onLoadChildren={onLoadChildren}
            fieldNames={fieldNames}
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

export interface CheckTreeSelectProps
  extends Omit<PickerProps, 'data' | 'onChange' | 'value' | 'trigger' | 'scrollable'> {
  /**
   * 展示数据
   */
  data?: CheckTreeSelectDataItem[]
  /**
   * 设置 data 中 id, title, disabled, children 对应的 key (3.0 新增)	object	-	{ title: 'title', id: 'id',disabled:'disabled', children: 'children'}
   */
  fieldNames?: Record<string, string>
  /**
   * 多选数据交互时回填、回显模式
   * PARENT: 当所有子节点被选中时将只保留父节点
   * ALL: 所有被选中节点，不区分父子节点（不支持异步数据加载勾选checkbox）
   * CHILD: 仅显示子节点（不支持异步数据加载勾选checkbox）
   * SEPARATE：父子完全独立受控
   */
  checkedMode?: 'ALL' | 'PARENT' | 'CHILD' | 'SEPARATE'
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
  defaultValue?: React.ReactText[]
  /**
   * 默认选中项 （受控）
   */
  value?: React.ReactText[]
  /**
   * 自定义渲染 Input 中展示内容
   */
  displayRender?: (item: CheckTreeSelectDataItem) => React.ReactNode
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
  filterOption?: (keyword: string, item: CheckTreeSelectDataItem) => boolean
  /**
   * 自定义渲染节点的 title 内容
   */
  render?: (node: CheckTreeSelectItemEventData) => React.ReactNode
  /**
   * 点击异步加载子项
   */
  onLoadChildren?: (
    node: CheckTreeSelectItemEventData
  ) => void | Promise<CheckTreeSelectDataItem[] | void>
  /**
   * 异步加载数据。暂不对外暴露
   */
  // dataSource?: UseDataSource<CheckTreeSelectDataItem[]>
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
   * checkedIds: 选中项 ID 集合
   * checkedNodes: 选中项数据项集合
   * targetNode: 当前操作节点，清空时为 null
   * checked: 当前操作是否为选中操作
   */
  onChange?: (
    checkedIds: React.ReactText[],
    options: {
      checkedNodes: CheckTreeSelectDataItem[]
      semiCheckedIds: React.ReactText[]
      targetNode: CheckTreeSelectItemEventData | null
      checked: boolean
    }
  ) => void
  /**
   * 是否可清空
   */
  clearable?: boolean
  /**
   * 设置展现形式
   */
  appearance?: CheckTreeSelectAppearanceEnum
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
  CheckTreeSelect.displayName = 'CheckTreeSelect'
}

const ALWAYS_ALLOW = () => true

/**
 * 在 checkedIdsSet 为数据合法的情况下，查找所有的半选中态的节点 ids
 *
 * @param checkedIdsSet
 * @param flattedData
 * @returns
 */
export const getSemiCheckedIdsWithSet = (
  flattedData: FlattedTreeNodeData[],
  isChecked: (id: React.ReactText) => boolean,
  allowCheck: (targetItem: FlattedTreeNodeData) => boolean = ALWAYS_ALLOW
) => {
  const semiCheckedNodes = [] as FlattedTreeNodeData[]
  const semiCheckedIdsSet = new Set<React.ReactText>()

  let parentId: React.ReactText | undefined
  let parent: FlattedTreeNodeData | undefined

  flattedData.forEach((node) => {
    parent = node.parent

    if (parent && parent.id !== undefined) {
      if (!allowCheck(parent)) return

      parentId = parent.id
      if (semiCheckedIdsSet.has(parentId)) return

      // 父节点没选中，但是当前节点被选中，则视为半选
      if (!isChecked(parentId) && isChecked(node.id)) {
        semiCheckedIdsSet.add(parentId)
        semiCheckedNodes.push(parent)
      }
    }
  })

  // 自下而上设置半选态
  semiCheckedNodes.forEach((node) => {
    parent = node.parent
    while (parent && parent.id !== undefined) {
      if (!allowCheck(parent)) return

      parentId = parent.id
      // 可能存在兄弟节点，共同祖先需要去重，避免重复计算
      if (semiCheckedIdsSet.has(parentId)) return

      semiCheckedIdsSet.add(parentId)
      parent = parent.parent
    }
  })

  const semiCheckedIds = Array.from(semiCheckedIdsSet)
  return [semiCheckedIds, semiCheckedIdsSet] as const
}
