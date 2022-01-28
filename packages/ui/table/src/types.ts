import React from 'react'
import { SelectProps } from '@hi-ui/select'
import { ValueOf } from '@hi-ui/core'
import { PaginationProps } from '@hi-ui/pagination'

export type TableAlign = 'left' | 'right' | 'center'

export type TableFrozenColumnOptions = {
  left?: React.ReactText
  right?: React.ReactText
}

export type TableExtra = {
  footer?: React.ReactNode
  header?: React.ReactNode
}

export type TableCheckAllOptions = {
  title?: React.ReactNode
  filterIcon?: React.ReactNode
  render?: (
    checkboxNode: React.ReactNode
    // , rowItem: object, rowIndex: number
  ) => React.ReactNode
}

export type TableRowSelection = {
  checkboxColWidth?: number
  selectedRowKeys?: React.ReactText[]
  getCheckboxConfig?: (rowData: object) => { disabled?: boolean }
  onChange?: (
    selectedRowKeys: React.ReactText[],
    targetRow?: object | object[],
    shouldChecked?: boolean
  ) => void
  /**
   * @private
   */
  // render?: (
  //   checkboxNode: React.ReactNode,
  //   rowItem: object,
  //   rowIndex: number,
  //   dataKey: string
  // ) => React.ReactNode
  /**
   * 全选配置集合
   */
  checkAllOptions?: TableCheckAllOptions
}

export type TableRowReturn = {
  onClick?: (event: React.MouseEvent) => void
  onDoubleClick?: (event: React.MouseEvent) => void
  onContextMenu?: (event: React.MouseEvent) => void
  onMouseEnter?: (event: React.MouseEvent) => void
  onMouseLeave?: (event: React.MouseEvent) => void
}

export type TableHeaderRowFunc = (columns: TableColumnItem[], index: number) => TableRowReturn
export type TableRowFunc = () => TableRowReturn

export type TableColumnItem = {
  title: React.ReactNode
  dataKey?: string
  align?: TableAlign
  sorter?: (a: any, b: any) => number
  avg?: boolean
  total?: boolean
  width?: number
  children?: TableColumnItem[]
  selectFilters?: SelectProps
  defaultSortOrder?: 'ascend' | 'descend'
  render?: (
    text: any,
    rowItem: Record<string, any>,
    rowIndex: number,
    dataKey: string
  ) =>
    | React.ReactNode
    | { children: React.ReactNode; props: { colSpan?: number; rowSpan?: number } }
  // @DEPRECATED
  filterIcon?: React.ReactNode
  filterDropdownWidth?: number
  filterDropdownClassName?: string
  filterDropdown?: (props: {
    ColumnItem: TableColumnItem
    setFilterDropdownVisible: Function
  }) => React.ReactNode
  onFilterDropdownVisibleChange?: (filterDropdownVisible: boolean, item: TableColumnItem) => void
}

export type TableDataSource = {
  url: string
  currentPageName?: string
  auto?: boolean
  autoDelayTime?: number
  headers?: object
  data?: object
  success?: (response: object) => any
  error?: (err: object) => void
  type?: 'GET' | 'POST'
  withCredentials?: boolean
  transformResponse?: (response: object) => object[]
}

export interface TablePaginationProps extends PaginationProps {
  // TODO： 建议统一关键词 center
  placement?: 'left' | 'middle'
}

export interface TableRowData extends Record<string, any> {
  /**
   * 树节点唯一 id
   */
  key?: React.ReactText
  // /**
  //  * 该节点的子节点列表
  //  */
  // children?: TableRowData[]
  // /**
  //  * 是否为叶子节点
  //  */
  // isLeaf?: boolean
}

export interface FlattedTableRowData extends TableRowData {
  /**
   * 树节点唯一 id
   */
  id: React.ReactText
  /**
   * 该节点的子节点列表
   */
  children?: FlattedTableRowData[]
  /**
   * 关联用户传入的原始节点
   */
  raw: TableRowData
  /**
   * 该节点的层级，从 0（顶层）开始
   */
  depth: number
  /**
   * 该节点的父节点
   */
  parent?: FlattedTableRowData
  /**
   * 节点所在列表数据中的下标
   */
  pos?: number
}

export interface FlattedTableColumnItemData extends TableColumnItem {
  /**
   * 树节点唯一 id
   */
  id: string
  /**
   * 该节点的子节点列表
   */
  children?: FlattedTableColumnItemData[]
  /**
   * 关联用户传入的原始节点
   */
  raw: TableColumnItem
  /**
   * 该节点的层级，从 0（顶层）开始
   */
  depth: number
  /**
   * 该节点的父节点
   */
  parent?: FlattedTableColumnItemData
  /**
   * 节点所在列表数据中的下标
   */
  pos?: number
  leftStickyWidth?: number
  rightStickyWidth?: number
}

export interface TableNodeRequiredProps {
  // expanded: boolean
  // checked: boolean
  // semiChecked: boolean
  // selected: boolean
  // loading: boolean
  // focused: boolean
}

export interface TableRowEventData extends FlattedTableRowData, TableNodeRequiredProps {}

// 表示节点类型
export const TreeNodeType = {
  SHOW: 'show',
  HIDE: 'hide',
  ADD: 'add',
} as const

// eslint-disable-next-line no-redeclare
export type TreeNodeType = ValueOf<typeof TreeNodeType>

export interface TableRowRequiredProps {
  expanded: boolean
  checked: boolean
  semiChecked: boolean
  selected: boolean
  loading: boolean
  focused: boolean
}

export type TableRowRecord = Record<string, any>
