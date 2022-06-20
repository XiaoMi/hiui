import React from "react"

export interface SearchItem {
  id: string | number
  title: string | JSX.Element
  children?: SearchItem[]
}

export interface SearchProps {
  prepend?: string | JSX.Element
  append?: JSX.Element
  disabled?: boolean
  loading?: boolean
  placeholder?: string
  data?: SearchItem
  onSearch?: (inputVal: string, item?: SearchItem) => void
  onChange?: (e: string) => void
  overlayClassName?: string
  style?: React.CSSProperties
  className?: string
}
declare const Search: React.ComponentType<SearchProps>
export default Search
