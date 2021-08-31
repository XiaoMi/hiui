import React, { useState } from 'react'
import Pagination from '../src'

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
          onChange={(cur) => {
            updateCurrent(cur)
          }}
        />
      </div>
    </>
  )
}
