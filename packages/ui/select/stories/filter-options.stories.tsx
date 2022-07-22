import React from 'react'
import Select from '../src'

/**
 * @title 自定义筛选
 * @desc 通过 filterOption 可自定义搜索条件的算法
 */
export const FilterOptions = () => {
  const [data] = React.useState([
    { title: '电视', id: '3', disabled: true },
    { title: '手机', id: '2' },
    { title: '笔记本', id: '4', disabled: true },
    { title: '生活周边', id: '5' },
    { title: '办公', id: '6' },
  ])

  // 注意 filterOption 是影响搜索渲染的，是完全受控的，useCallback 包裹可以减少无效的重渲染，提升性能
  const filterOptionMemo = React.useCallback((keyword: string, item: any) => {
    return item.id >= parseInt(keyword)
  }, [])

  return (
    <>
      <h1>FilterOptions</h1>
      <div className="select-filter-options__wrap">
        <Select
          style={{ width: 240 }}
          clearable={false}
          data={data}
          searchPlaceholder="搜索：id >= keyword"
          filterOption={filterOptionMemo}
        />
      </div>
    </>
  )
}
