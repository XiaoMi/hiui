import React from 'react'
import Search from '../src'

/**
 * @title 基础用法
 * @desc 按搜索关键字直接请求结果
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="search-basic__wrap">
        <Search
          style={{ width: 260 }}
          placeholder="搜索关键字"
          onSearch={(keyword) => {
            console.log('onSearch', keyword)
          }}
        />
      </div>
    </>
  )
}
