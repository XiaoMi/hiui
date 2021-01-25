type Item = {
  id: string | number
  title: string | JSX.Element
}
interface DataItem extends Item{
  children?: Item[]
}
interface Props {
  prepend?: string | JSX.Element
  append?: JSX.Element
  disabled?: boolean
  loading?: boolean
  placeholder?: string
  data?: DataItem
  onSearch?: (inputVal: string, item?: DataItem) => void
  onChange?: (e: string) => void
  overlayClassName?: string
}
declare const Search: React.ComponentType<Props>
export default Search
