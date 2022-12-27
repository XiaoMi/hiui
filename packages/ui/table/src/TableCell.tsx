import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { __DEV__ } from '@hi-ui/env'
import { times } from '@hi-ui/array-utils'
import { isObject, isFunction } from '@hi-ui/type-assertion'
import { IconButton } from '@hi-ui/icon-button'
import { useTableContext } from './context'
import { TableRowEventData, FlattedTableRowData, FlattedTableColumnItemData } from './types'
import {
  defaultCollapseIcon,
  defaultExpandIcon,
  defaultLeafIcon,
  defaultLoadingIcon,
} from './icons'
import { EMBED_DATA_KEY } from './BaseTable'

const _prefix = getPrefixCls('table-cell')

/**
 * 表格 body 单元格渲染
 */
export const TableCell = forwardRef<HTMLTableCellElement | null, TableCellProps>(
  (
    {
      prefixCls = _prefix,
      className,
      column,
      rowData,
      rowIndex,
      colIndex,
      isSwitcherCol = false,
      expandedTree = false,
      // icons
      expandedIcon = defaultExpandIcon,
      collapsedIcon = defaultCollapseIcon,
      leafIcon = defaultLeafIcon,
    },
    ref
  ) => {
    const {
      isHighlightedCol,
      onLoadChildren,
      isHoveredHighlightCol,
      showColHighlight,
      onHoveredColChange,
      onTreeNodeSwitch,
      getStickyColProps,
      canScroll,
      isTree,
      cellRender,
      isLoadingTreeNodeId,
      colWidths,
      virtual,
    } = useTableContext()

    const { id: dataKey, leftStickyWidth, rightStickyWidth, render: rawRender, raw } = column
    const { depth, id: rowId } = rowData

    /**
     * normalize 单元格渲染内容，支持自定义 render
     */
    const cellContent = React.useMemo(() => {
      const row = rowData.raw
      let content = row[dataKey]

      if (isFunction(rawRender)) {
        content = rawRender(content, EMBED_DATA_KEY === dataKey ? rowData : row, rowIndex, dataKey)
      } else if (isFunction(cellRender)) {
        content = cellRender(content)
      }

      //  处理单元格内容，重载支持配置式合并单元格
      const childrenMaybePropsReturn = isObject(content) && !React.isValidElement(content)

      if (childrenMaybePropsReturn) {
        return content
      }

      return {
        children: content,
        props: {
          colSpan: undefined,
          rowSpan: undefined,
        },
      }
    }, [rawRender, dataKey, rowData, rowIndex, cellRender])

    // 将被其它单元格（用户配置）合并，不进行渲染
    if (cellContent.props.colSpan === 0 || cellContent.props.rowSpan === 0) {
      return null
    }

    const loading = isLoadingTreeNodeId(rowId)
    const sticky = typeof rightStickyWidth !== 'undefined' || typeof leftStickyWidth !== 'undefined'

    const cls = cx(
      prefixCls,
      className,
      raw.className,
      canScroll && sticky && `${prefixCls}__col--sticky`,
      isHighlightedCol(dataKey) && `${prefixCls}__col--highlight`,
      isHoveredHighlightCol(dataKey) && `${prefixCls}__col--hovered-highlight`
    )

    if (virtual) {
      const width = colWidths[colIndex]
      const colProps = getStickyColProps(column)
      return (
        <div
          ref={ref}
          key={dataKey}
          className={cls}
          {...colProps}
          // 按需绑定函数，避免频繁调用 setState 特别消耗性能
          onMouseEnter={showColHighlight ? () => onHoveredColChange(column, true) : undefined}
          onMouseLeave={showColHighlight ? () => onHoveredColChange(column, false) : undefined}
          style={{ ...colProps.style, width: width }}
        >
          {/* 渲染树形表格缩进 */}
          {isSwitcherCol && depth > 0 ? renderIndent({ depth, prefixCls }) : null}
          {/* 渲染树形表格切换器 */}
          {isSwitcherCol
            ? renderSwitcher({
                prefixCls,
                node: rowData,
                loading,
                expanded: expandedTree,
                expandedIcon,
                collapsedIcon,
                leafIcon,
                onLoadChildren,
                isTree,
                onNodeExpand: (shouldExpanded) => onTreeNodeSwitch(rowData, shouldExpanded),
              })
            : null}
          {cellContent.children}
        </div>
      )
    }

    return (
      <td
        ref={ref}
        key={dataKey}
        className={cls}
        {...getStickyColProps(column)}
        colSpan={cellContent.props.colSpan}
        rowSpan={cellContent.props.rowSpan}
        // 按需绑定函数，避免频繁调用 setState 特别消耗性能
        onMouseEnter={showColHighlight ? () => onHoveredColChange(column, true) : undefined}
        onMouseLeave={showColHighlight ? () => onHoveredColChange(column, false) : undefined}
      >
        {/* 渲染树形表格缩进 */}
        {isSwitcherCol && depth > 0 ? renderIndent({ depth, prefixCls }) : null}
        {/* 渲染树形表格切换器 */}
        {isSwitcherCol
          ? renderSwitcher({
              prefixCls,
              node: rowData,
              loading,
              expanded: expandedTree,
              expandedIcon,
              collapsedIcon,
              leafIcon,
              onLoadChildren,
              isTree,
              onNodeExpand: (shouldExpanded) => onTreeNodeSwitch(rowData, shouldExpanded),
            })
          : null}
        {cellContent.children}
      </td>
    )
  }
)

export interface TableCellProps extends HiBaseHTMLProps<'td'> {
  /**
   * 表格当前列配置信息
   */
  column: FlattedTableColumnItemData
  /**
   * 表格行数据
   */
  rowData: FlattedTableRowData
  /**
   * 表格行数据下标
   */
  rowIndex: number
  /**
   * 表格行数据下标
   */
  colIndex: number
  /**
   * 是否展开树表格行
   */
  expandedTree?: boolean
  /**
   *  作为操作树节点展开列（数据第一列）
   */
  isSwitcherCol?: boolean
  /**
   * 节点收起时的默认图标
   */
  collapsedIcon?: React.ReactNode
  /**
   * 节点展开时的默认图标
   */
  expandedIcon?: React.ReactNode
  /**
   * 叶子结点的默认图标
   */
  leafIcon?: React.ReactNode
}

if (__DEV__) {
  TableCell.displayName = 'TableCell'
}

/**
 * 渲染空白占位
 */
const renderIndent = ({ prefixCls, depth }: { prefixCls?: string; depth: number }) => {
  return times(depth, (index) => {
    return <span className={`${prefixCls}__indent`} key={index} />
  })
}

/**
 * 渲染子树折叠切换器
 */
const renderSwitcher = ({
  prefixCls,
  node,
  loading,
  expanded,
  expandedIcon,
  collapsedIcon,
  leafIcon,
  onNodeExpand,
  onLoadChildren,
  isTree,
}: {
  node: any
  prefixCls: string
  loading: boolean
  expanded: boolean
  expandedIcon: React.ReactNode
  collapsedIcon: React.ReactNode
  leafIcon: React.ReactNode
  onNodeExpand: (shouldExpanded: boolean) => void
  onLoadChildren?: (node: TableRowEventData) => void | Promise<any>
  isTree?: boolean
}) => {
  if (loading) {
    return (
      <IconButton
        className={cx(`${prefixCls}__switcher`, `${prefixCls}__switcher--loading`)}
        icon={defaultLoadingIcon}
      />
    )
  }

  const hasChildren = node.children && node.children.length > 0
  const canLoadChildren = onLoadChildren && !node.children && !node.isLeaf

  if (hasChildren || canLoadChildren) {
    return (
      <IconButton
        tabIndex={-1}
        className={cx(
          `${prefixCls}__switcher`,
          `${prefixCls}__switcher--${expanded ? 'expanded' : 'collapse'}`
        )}
        icon={expanded ? expandedIcon : collapsedIcon}
        onClick={() => {
          const shouldExpanded = !expanded
          onNodeExpand(shouldExpanded)
        }}
      />
    )
  }

  if (isTree) {
    return (
      <IconButton
        tabIndex={-1}
        className={cx(`${prefixCls}__switcher`, `${prefixCls}__switcher--noop`)}
        icon={leafIcon}
      />
    )
  }

  return null
}
