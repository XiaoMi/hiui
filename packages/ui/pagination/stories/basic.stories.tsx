import React, { useState } from 'react'
import Pagination from '../src'

/**
 * @title 基础用法
 * @desc 常见的分页用法，用于数据量或分页数适中的场景，进行基础翻页操作
 */
export const Basic = () => {
  const [current, updateCurrent] = useState(1)
  return (
    <>
      <h1>Basic for Pagination</h1>
      <div className="pagination-basic__wrap">
        <Pagination
          total={200}
          pageSize={10}
          current={current}
          onChange={(cur, prev, pageSize) => {
            updateCurrent(cur)
            console.log('onChange', cur, prev, pageSize)
          }}
        />
      </div>
    </>
  )
}
