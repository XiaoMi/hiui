import React from 'react'
import Select from '../src'

/**
 * @title 清空选中项
 */
export const Clearable = () => {
  const [data] = React.useState([
    { title: '电视', id: '3', disabled: false },
    { title: '手机', id: '2' },
    { title: '笔记本', id: '4', disabled: false },
    { title: '生活周边', id: '5' },
    { title: '办公', id: '6' },
  ])

  return (
    <>
      <h1>Clearable</h1>
      <div className="select-clearable__wrap">
        <Select style={{ width: 240 }} clearable data={data} onChange={console.log} />
      </div>
    </>
  )
}
