import React from 'react'
import Search from '../src'
import Select from '@hi-ui/select'

/**
 * @title 分类检索
 * @desc 按不同的类别划分搜索范围；可减少搜索成本
 */
export const Classify = () => {
  return (
    <>
      <h1>分类检索</h1>
      <div className="search-classify__wrap">
        <Search
          style={{ width: 360 }}
          placeholder="搜索关键字"
          prepend={
            <Select
              clearable={false}
              style={{ width: 90 }}
              onChange={(selectedIds, changedItem) => {
                console.log(selectedIds, changedItem)
              }}
              data={[
                { title: '订单号', id: '1' },
                { title: '用户名', id: '2' },
              ]}
              defaultValue="1"
            />
          }
          onSearch={(title) => {
            console.log('Input Value', title)
          }}
        />
      </div>
    </>
  )
}
