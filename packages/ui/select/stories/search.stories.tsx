import React from 'react'
import Select, { SelectOption } from '../src'

const data = [
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
]

export const Search = () => {
  return (
    <>
      <h1>Search</h1>
      <div className="cascader-search__wrap">
        <Select searchable placeholder="请选择品类" searchPlaceholder="请输入搜索内容">
          {data.map((item) => {
            return (
              <SelectOption key={item.id} value={item.id}>
                {item.title}
              </SelectOption>
            )
          })}
        </Select>
      </div>
    </>
  )
}
