import React from 'react'
import { PaginationProps } from '@hi-ui/pagination'
import { PopperOverlayProps } from '@hi-ui/popper'

export type TableColumnItemAlignEnum = 'left' | 'right' | 'center'

export type TableFrozenColumnOptions = {
  /**
   * 表格从左侧冻结至某列
   */
  left?: React.ReactText
  /**
   * 表格从右侧冻结至某列
   */
  right?: React.ReactText
}

export type TableExtra = {
  footer?: React.ReactNode
  header?: React.ReactNode
}

export type TableCheckAllOptions = {
  /**
   * 添加全选按钮右侧过滤 icon
   */
  filterIcon?: React.ReactNode
  /**
   * 自定义渲染全选内容
   */
  render?: (
    checkboxNode: React.ReactNode
    // , rowItem: object, rowIndex: number
  ) => React.ReactNode
}

export type TableRowSelection = {
  /**
   * 设置选中列列宽
   */
  checkboxColWidth?: number
  /**
   * 选中的行 ids（受控）
   */
  selectedRowKeys?: React.ReactText[]
  /**
   *  行选择的配置项
   */
  getCheckboxConfig?: (rowData: object) => { disabled?: boolean }
  /**
   * 选中项发生变化时的回调
   */
  onChange?: (
    selectedRowKeys: React.ReactText[],
    targetRow?: object | object[],
    shouldChecked?: boolean,
    selectedRows?: object[]
  ) => void
  /**
   * 全选配置集合
   */
  checkAllOptions?: TableCheckAllOptions
  /**
   *。暂不对外暴露
   * @private
   */
  // render?: (
  //   checkboxNode: React.ReactNode,
  //   rowItem: object,
  //   rowIndex: number,
  //   dataKey: string
  // ) => React.ReactNode
}

export type TableOnRowReturn = {
  /**
   * 行点击事件
   */
  onClick?: (event: React.MouseEvent) => void
  /**
   * 行双击事件
   */
  onDoubleClick?: (event: React.MouseEvent) => void
  /**
   * 行右键菜单事件
   */
  onContextMenu?: (event: React.MouseEvent) => void
  /**
   * 行鼠标入场事件
   */
  onMouseEnter?: (event: React.MouseEvent) => void
  /**
   * 行鼠标出场事件
   */
  onMouseLeave?: (event: React.MouseEvent) => void
}

export interface TableColumnItemRenderReturn {
  children: React.ReactNode
  props: {
    colSpan?: number
    rowSpan?: number
  }
}

export type TableColumnItem = {
  /**
   * 列标题
   */
  title: React.ReactNode | ((column: TableColumnEventData) => React.ReactNode)
  /**
   * 列对应数据项的唯一标识
   */
  dataKey?: string
  /**
   * 该列宽度
   */
  width?: number
  /**
   * 列对齐方式
   */
  align?: TableColumnItemAlignEnum
  /**
   * 列排序函数
   */
  sorter?: (a: any, b: any) => number
  /**
   * 该列是否支持平均值
   */
  avg?: boolean
  /**
   * 该列是否支持合计
   */
  total?: boolean
  /**
   * 多级表头
   */
  children?: TableColumnItem[]
  /**
   * 控制单元格自定义渲染
   */
  render?: (
    text: any,
    rowItem: Record<string, any>,
    rowIndex: number,
    dataKey: string
  ) => React.ReactNode | TableColumnItemRenderReturn
  /**
   * 列类名 className
   */
  className?: string
  /**
   * 自定义 filter 图标
   */
  filterIcon?: React.ReactNode
  /**
   * 自定义筛选菜单宽度
   */
  filterDropdownWidth?: number
  /**
   * 受控控制 dropdown 显隐
   */
  filterDropdownVisible?: boolean
  /**
   * 自定义筛选菜单 className
   */
  filterDropdownClassName?: string
  /**
   * 自定义筛选菜单弹窗交互
   */
  filterDropdownOverlay?: PopperOverlayProps
  /**
   * 自定义筛选下拉选项显示状态改变时的回调方法
   */
  onFilterDropdownVisibleChange?: (filterDropdownVisible: boolean, item: TableColumnItem) => void
  /**
   * 自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互
   */
  filterDropdown?: (props: {
    columnData: TableColumnItem
    setFilterDropdownVisible: Function
  }) => React.ReactNode
}

export type TableDataSource = {
  url: string
  currentPageName?: string
  auto?: boolean
  autoDelayTime?: number
  headers?: object
  data?: object
  params?: object
  success?: (response: object) => any
  error?: (err: object) => void
  type?: 'GET' | 'POST'
  withCredentials?: boolean
  transformResponse?: (
    response: object
  ) => {
    list: object[]
    total: number
  }
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

export interface TableColumnEventData extends FlattedTableColumnItemData {}
export interface TableRowEventData extends FlattedTableRowData {}

export interface TableRowRequiredProps {
  expanded: boolean
  checked: boolean
  semiChecked: boolean
  selected: boolean
  loading: boolean
  focused: boolean
}

export type TableRowRecord = Record<string, any>
