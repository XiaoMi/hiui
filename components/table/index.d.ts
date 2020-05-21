
type ColumnItem = {
  title: string | JSX.Element
  dataIndex: string
  key: string
  fixed?: 'left' | 'right'
  width?: number
  render?: (text: string, record: object, index: number) => JSX.Element
}
type Advance = {
  sum?: boolean
  ave?: boolean
  header?: JSX.Element
  footer?: JSX.Element
  prefix?: object[]
  suffix?: object[]
}
type Origin = {
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
}
interface Props {
  size?: 'small' | 'large' | 'default'
  bordered?: boolean
  striped?: boolean
  columns: ColumnItem[]
  data: object[]
  emptyText?: string | JSX.Element
  scrollX?: boolean
  fixTop?: number
  height?: string
  pagination?: PaginationProps
  advance?: Advance
  origin?: Origin
}
declare const Table: React.ComponentType<Props>
export default Table
