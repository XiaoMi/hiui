import React, { useState } from 'react'
import { Pagination } from '../src'

export const MiniInput = () => {
  const [current, setCurrent] = useState(1)
  return (
    <>
      <h1>MiniInput</h1>
      <div className="pagination-mini-input__wrap">
        <Pagination
          type="shrink"
          total={200}
          pageSize={10}
          current={current}
          onChange={(cur) => {
            console.log('onChange', cur)
            setCurrent(cur)
          }}
        />
      </div>
    </>
  )
}
