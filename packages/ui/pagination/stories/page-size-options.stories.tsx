import React, { useState } from 'react'
import Pagination from '../src'

/**
 * @title 每页最大条数
 * @desc 数据量庞大，分页数较多时使用
 */
export const PageSizeOptions = () => {
  const [current, updateCurrent] = useState(1)
  const [pageSize, updatePageSize] = useState(10)

  return (
    <>
      <h1>Different page size options</h1>
      <div className="pagination-basic__wrap">
        <Pagination
          total={200}
          pageSize={pageSize}
          showTotal
          showJumper
          pageSizeOptions={[10, 20, 50, 100]}
          onPageSizeChange={(pageSize, current) => {
            console.log('onPageSizeChange', pageSize, current)
            updatePageSize(pageSize)
          }}
          current={current}
          onChange={(cur, prev, pageSize) => {
            console.log('onChange', cur, prev, pageSize)
            updateCurrent(cur)
          }}
        />
      </div>
    </>
  )
}
