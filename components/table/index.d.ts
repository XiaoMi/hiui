import {PaginationProps} from '../pagination'
export type ColumnItem = {
  title: string | JSX.Element
  dataKey: string
  align?: 'left' | 'right'
  sorter?: () => boolean
  avg?: boolean
  total?: boolean
  width?: number
  children?: ColumnItem[]
  render?: (text: string, record: object, index: number, dataKey: string) => JSX.Element
}

export type Origin = {
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
export type FixedOption = {
  left?: string
  right?: string
}
export type RowSelection = {
  selectedRowKeys?: string[] | number[]
  onChange?: (selectedRowKeys: string | number) => void
}

export type HeaderRowReturn = {
  onClick?: (event: MouseEvent) => void
  onDoubleClick?: (event: MouseEvent) => void
  onContextMenu?: (event: MouseEvent) => void
  onMouseEnter?: (event: MouseEvent) => void
  onMouseLeave?: (event: MouseEvent) => void
}

export type HeaderRowFunc = (colums: ColumnItem[], index: number) => HeaderRowReturn

export interface Props {
  size?: 'small' | 'large' | 'default' | 'mini'
  bordered?: boolean
  striped?: boolean
  loading?: boolean
  sticky?: boolean
  stickyTop?: number
  expandRowKeys?: number[]
  highlightedColKeys?: string[] | number[]
  expandedRender?: (record: object, index: number) => JSX.Element | Promise
  onLoadChildren?: (record: object) => object[] | Promise
  onExpand?: (expanded: boolean, rowData: object) => void
  rowExpandable?: (record: object ) => JSX.Element | Boolean
  maxHeight?: number
  scrollWidth?: number
  fixedToColumn?: string | FixedOption
  pagination?: PaginationProps
  errorRowKeys?: string[] | number[]
  highlightedRowKeys?: string[] | number[]
  rowSelection?: RowSelection
  dataSource?: (current: number) => Origin
  showColMenu?: boolean
  showColHighlight?: boolean
  striped?: boolean
  setting?: boolean
  resizable?: boolean
  standard?: boolean
  emptyContent?: string | JSX.Element
  onHeaderRow?: HeaderRowFunc
  columns: ColumnItem[]
  data: object[]
  style?: CSSProperties
  className?: string
  scrollWidth?: React.ReactText
}
declare const Table: React.ComponentType<Props>
export default Table
