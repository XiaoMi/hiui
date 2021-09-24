export type Item = {
  id: string | number
  title: string | JSX.Element
}
export interface DataItem extends Item{
  children?: Item[]
}
export interface Props {
  prepend?: string | JSX.Element
  append?: JSX.Element
  disabled?: boolean
  loading?: boolean
  placeholder?: string
  data?: DataItem
  onSearch?: (inputVal: string, item?: DataItem) => void
  onChange?: (e: string) => void
  overlayClassName?: string
  style?: CSSProperties
  className?: string
}
declare const Search: React.ComponentType<Props>
export default Search
