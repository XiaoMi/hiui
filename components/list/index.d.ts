import React from 'react'
import {PaginationProps} from '../pagination'

export type ListItem = {
  title: string | JSX.Element
  titleTag?: string | JSX.Element
  titleTagType?: 'primary' | 'success' |'warning' | 'danger'
  description?: string | JSX.Element
  extra?: string | string[]
  avatar?: string
  style?: React.CSSProperties
  className?: string
}
export interface ListProps {
  type?: 'default' | 'card'
  data: ListItem[]
  renderItem?: (item: ListItem) => JSX.Element
  action?: (item: ListItem) => JSX.Element
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
declare const List: React.ComponentType<ListProps>
export default List
