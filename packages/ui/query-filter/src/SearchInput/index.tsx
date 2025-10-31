import React from 'react'
import { getPrefixCls } from '@hi-ui/classname'
import { SearchOutlined } from '@hi-ui/icons'
import Input, { InputProps } from '@hi-ui/input'

const prefixCls = getPrefixCls('query-filter-search-input')

export const SearchInput: React.FC<SearchInputProps> = ({ ...restProps }) => {
  return (
    <Input
      className={prefixCls}
      style={{ width: 200 }}
      clearable
      appearance="filled"
      prefix={<SearchOutlined />}
      {...restProps}
    />
  )
}

export type SearchInputProps = InputProps
