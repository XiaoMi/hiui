import React, { useState } from 'react'
import Pagination from '../src'

export const PageSizeOptions = () => {
  const [current, updateCurrent] = useState(1)
  const [pageSize, updatePageSize] = useState(10)
  console.log(999, pageSize)
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
            updatePageSize(pageSize)
          }}
          current={current}
          onChange={(cur) => {
            updateCurrent(cur)
          }}
        />
      </div>
    </>
  )
}
