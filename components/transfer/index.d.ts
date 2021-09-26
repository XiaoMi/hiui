import React from 'react'
export type TransferItem = {
  id: string | number
  content: string | JSX.Element
  disabled?: boolean
}
export interface TransferProps {
  type?: 'default' | 'multiple'
  showCheckAll?: boolean
  searchable?: boolean
  disabled?: boolean
  title?: string[] | JSX.Element[]
  emptyContent?: string[] | JSX.Element[]
  data: TransferItem[]
  targetLimit?: number
  targetIds?: number[] | string[]
  targetSortType?: 'default' | 'queue'
  onChange?: (targetKey: number[] | string[], direction: 'left' | 'right', moveDatas: TransferItem[]) => void
  render?: (item: TransferItem) => JSX.Element
  onDragStart?: (item: TransferItem) => Boolean
  onDragEnd?: (item: TransferItem) => void
  onDrop?: (targetItem: TransferItem, sourceItem: TransferItem) => boolean
}
declare const Transfer: React.ComponentType<TransferProps>
export default Transfer
