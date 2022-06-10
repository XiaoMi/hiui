import React from 'react'
import VirtualList from '../src'

/**
 * @title 基础用法
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="virtual-list-basic__wrap">
        <VirtualList data={[{ id: 1, title: '1' }]} itemKey="id">
          {(item) => {
            return <div>{item.title}</div>
          }}
        </VirtualList>
      </div>
    </>
  )
}
