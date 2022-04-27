import React from 'react'
import Select from '../src'

/**
 * @title 带搜索
 */
export const Search = () => {
  const [data] = React.useState([
    {
      id: 'up-1',
      title: 'up',
    },
    {
      id: '0',
      title: '0',
    },
    {
      id: '1',
      title: '1',
    },
    {
      id: '2',
      title: '2',
    },
  ])
  return (
    <>
      <h1>Search</h1>
      <div className="cascader-search__wrap">
        <Select
          searchable
          placeholder="请选择品类"
          searchPlaceholder="请输入搜索内容"
          data={data}
        />
      </div>
    </>
  )
}
