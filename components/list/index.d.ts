import {PaginationProps} from '../pagination'
export type DataItem = {
  title: string | JSX.Element
  titleTag?: string | JSX.Element
  titleTagType?: 'primary' | 'success' |'warning' | 'danger'
  description?: string | JSX.Element
  extra?: string | string[]
  avatar?: string
  style?: React.CSSProperties
  className?: string
}
export interface Props {
  type?: 'default' | 'card'
  data: DataItem[]
  renderItem?: (item: DataItem) => JSX.Element
  action?: (item: DataItem) => JSX.Element
  actionPosition?: 'top' | 'center' |'bottom'
  split?: boolean
  pagination?: boolean | PaginationProps
  bordered?: boolean
  hoverable?: boolean
  layout?: 'vertical' | 'horizontal'
  emptyText?: string | JSX.Element
  style?: React.CSSProperties
  className?: string
}
declare const List: React.ComponentType<Props>
export default List
