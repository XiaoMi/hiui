import React from 'react'
import CheckSelect from '../src'

/**
 * @title 禁用状态
 * @desc 暂不可操作的状态
 */
export const Disabled = () => {
  const [data] = React.useState([
    { title: '电视', id: '3', disabled: true },
    { title: '手机', id: '2' },
    { title: '笔记本', id: '4', disabled: true },
    { title: '生活周边', id: '5' },
    { title: '办公', id: '6' },
  ])
  return (
    <>
      <h1>Disabled</h1>
      <div className="check-select-basic__wrap">
        <CheckSelect placeholder="请选择" searchable disabled data={data} value={['2']} />
      </div>
    </>
  )
}
