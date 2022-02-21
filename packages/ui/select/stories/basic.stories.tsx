import React from 'react'
import Select from '../src'

export const Basic = () => {
  const [data] = React.useState([
    { title: '电视', id: '3', disabled: true },
    { title: '手机', id: '2' },
    { title: '笔记本', id: '4', disabled: true },
    {
      title: '生活周边超长文案展示超长文案展示',
      id: '5',
    },
    { title: '办公', id: '6' },
    { title: '生活周边7', id: '7' },
    { title: '办公8', id: '8' },
  ])

  return (
    <>
      <h1>Basic</h1>
      <div className="select-basic__wrap">
        <Select clearable={false} style={{ width: 200 }} data={data} />
      </div>
    </>
  )
}
