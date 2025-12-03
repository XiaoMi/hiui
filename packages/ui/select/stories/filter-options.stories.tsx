import React from 'react'
import Select from '../src'

/**
 * @title 自定义筛选
 * @desc 通过 filterOption 可自定义搜索条件的算法
 */
export const FilterOptions = () => {
  const [data] = React.useState([
    { title: '手机', id: 'shouji' },
    { title: '电脑', id: 'diannao' },
    { title: '电视', id: 'dianshi' },
    { title: '洗衣机', id: 'xiyiji' },
    { title: '冰箱', id: 'bingxiang' },
    { title: '空调', id: 'kongtiao' },
    { title: '汽车', id: 'qiche' },
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
