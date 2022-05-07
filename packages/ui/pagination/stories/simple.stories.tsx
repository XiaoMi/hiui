import React, { useState } from 'react'
import { Pagination } from '../src'

/**
 * @title 简洁用法
 * @desc 数据分批展示的形式，弱化页码
 */
export const Simple = () => {
  const [current, setCurrent] = useState(1)
  return (
    <>
      <h1>Simple</h1>
      <div className="pagination-simple__wrap">
        <Pagination
          type="shrink"
          total={200}
          pageSize={10}
          showJumper={false}
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
