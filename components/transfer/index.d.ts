type DataItem = {
  id: string | number
  content: string | JSX.Element
  disabled?: boolean
}
interface Props {
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
}
declare const Transfer: React.ComponentType<Props>
export default Transfer
