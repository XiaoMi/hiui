import React from 'react'
import Search from '../src'

/**
 * @title 不同尺寸
 */
export const Size = () => {
  return (
    <>
      <h1>Size</h1>
      <div className="search-size__wrap">
        <Search style={{ width: 260 }} placeholder="搜索关键字" size="sm" />
        <br />
        <br />
        <Search style={{ width: 260 }} placeholder="搜索关键字" size="md" />
        <br />
        <br />
        <Search style={{ width: 260 }} placeholder="搜索关键字" size="lg" />
      </div>
    </>
  )
}
