import React from 'react'
import Select from '../src'

/**
 * @title 不同尺寸
 */
export const Size = () => {
  const [data] = React.useState([
    { title: '电视', id: '3', disabled: false },
    { title: '手机', id: '2' },
    { title: '笔记本', id: '4', disabled: false },
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
      <h1>Size</h1>
      <div className="select-size__wrap">
        <h2>xs</h2>
        <Select style={{ width: 240 }} size="xs" clearable={false} data={data} />
        <h2>sm</h2>
        <Select style={{ width: 240 }} size="sm" clearable={false} data={data} />
        <h2>md</h2>
        <Select style={{ width: 240 }} size="md" clearable={false} data={data} />
        <h2>lg</h2>
        <Select style={{ width: 240 }} size="lg" clearable={false} data={data} />
      </div>
    </>
  )
}
