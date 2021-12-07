import React from 'react'
import { SelectProps } from '@hi-ui/select'

export type TableAlign = 'left' | 'right' | 'center'

export interface FixedOption {
  left?: string
  right?: string
}

export interface RowSelection {
  selectedRowKeys: string[]
  onChange: (selectedRowKeys: string[]) => void
  getCheckboxConfig: (rowData: object) => any
}

export type TableFixedOptions = {
  left?: string
  right?: string
}

export type TableRowSelection = {
  selectedRowKeys?: string[] | number[]
  getCheckboxConfig?: (rowData: object) => object
  onChange?: (
    selectedRowKeys: string | number,
    targetRow?: object | object[],
    shouldChecked?: boolean
  ) => void
}

export type TableHeaderRowReturn = {
  onClick?: (event: React.MouseEvent) => void
  onDoubleClick?: (event: React.MouseEvent) => void
  onContextMenu?: (event: React.MouseEvent) => void
  onMouseEnter?: (event: React.MouseEvent) => void
  onMouseLeave?: (event: React.MouseEvent) => void
}

export type HeaderRowFunc = (columns: TableColumnItem[], index: number) => TableHeaderRowReturn

export type TableColumnItem = {
  title: React.ReactNode
  dataKey: string
  align?: TableAlign
  sorter?: (a: any, b: any) => number
  avg?: boolean
  total?: boolean
  width?: number
  children?: TableColumnItem[]
  selectFilters?: SelectProps
  defaultSortOrder?: 'ascend' | 'descend'
  filterIcon?: React.ReactNode
  filterDropdown?: (props: {
    ColumnItem: TableColumnItem
    setFilterDropdownVisible: Function
  }) => React.ReactNode
  filterDropdownWidth?: number
  filterDropdownClassName?: string
  onFilterDropdownVisibleChange?: (filterDropdownVisible: boolean, item: TableColumnItem) => void
  render?: (text: string, record: object, index: number, dataKey: string) => React.ReactNode
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

export interface TableNodeData {
  /**
   * 树节点唯一 id
   */
  id: React.ReactText
  /**
   * 树节点标题
   */
  title: React.ReactNode
  /**
   * 该节点的子节点列表
   */
  children?: TableNodeData[]
  /**
   * 是否为叶子节点
   */
  isLeaf?: boolean
  /**
   * 是否禁用该节点
   */
  disabled?: boolean
}

export interface FlattedTableNodeData extends TableNodeData {
  /**
   * 该节点的子节点列表
   */
  children?: FlattedTableNodeData[]
  /**
   * 关联用户传入的原始节点
   */
  raw: TableNodeData
  /**
   * 该节点的层级，从 0（顶层）开始
   */
  depth: number
  /**
   * 该节点的父节点
   */
  parent?: FlattedTableNodeData
  /**
   * 节点所在列表数据中的下标
   */
  pos?: number
}

export interface TableNodeRequiredProps {
  expanded: boolean
  checked: boolean
  semiChecked: boolean
  selected: boolean
  loading: boolean
  focused: boolean
}

export interface TableNodeEventData extends FlattedTableNodeData, TableNodeRequiredProps {}
