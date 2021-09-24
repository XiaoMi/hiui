export type DataItem = {
  id: string | number
  content: string | JSX.Element
  disabled?: boolean
}
export interface Props {
  type?: 'default' | 'multiple'
  showCheckAll?: boolean
  searchable?: boolean
  disabled?: boolean
  title?: string[] | JSX.Element[]
  emptyContent?: string[] | JSX.Element[]
  data: DataItem[]
  targetLimit?: number
  targetIds?: number[] | string[]
  targetSortType?: 'default' | 'queue'
  onChange?: (targetKey: number[] | string[], direction: 'left' | 'right', moveDatas: DataItem[]) => void
  render?: (item: DataItem) => JSX.Element
  onDragStart?: (item: DataItem) => Boolean
  onDragEnd?: (item: DataItem) => void
  onDrop?: (targetItem: DataItem, sourceItem: DataItem) => boolean
}
declare const Transfer: React.ComponentType<Props>
export default Transfer
