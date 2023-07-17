import React from 'react'
import Select from '../src'

/**
 * @title 搜索关键字受控
 * @desc searchable 为 true 时生效
 */
export const SearchControlled = () => {
  const [keyword, setKeyword] = React.useState('1')

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
    {
      id: '11',
      title: '11',
    },
    {
      id: '12',
      title: '12',
    },
  ])

  return (
    <>
      <h1>Search Controlled</h1>
      <div className="select-search-controlled__wrap">
        <Select
          style={{ width: 240 }}
          searchable
          keyword={keyword}
          onSearch={(value) => {
            setKeyword(value)
            console.log('onSearch', value)
          }}
          clearKeywordOnClosed={false}
          placeholder="请选择品类"
          searchPlaceholder="请输入搜索内容"
          data={data}
        />
      </div>
    </>
  )
}
