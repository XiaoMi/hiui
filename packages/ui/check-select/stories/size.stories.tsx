import React from 'react'
import CheckSelect from '../src'

/**
 * @title 不同尺寸
 */
export const Size = () => {
  const [data] = React.useState([
    { title: '手机', id: '2' },
    { title: '小米2', id: '2-1' },
    { title: '小米3', id: '2-2' },
    { title: '小米4', id: '2-3' },
    { title: '小米5', id: '2-4' },
    { title: '电脑', id: '3' },
    { title: '笔记本', id: '4' },
    {
      title: '生活周边超长文案展示超长文案展示超长文案展示超长文案展示超长文案展示',
      id: '5',
    },
    { title: '其它', id: '6' },
  ])

  return (
    <>
      <h1>Size</h1>
      <div className="check-select-size__wrap">
        <h2>sm</h2>
        <CheckSelect
          style={{ width: 240 }}
          size="sm"
          placeholder="请选择"
          searchable
          clearable
          data={data}
        />
        <h2>md</h2>
        <CheckSelect
          style={{ width: 240 }}
          size="md"
          placeholder="请选择"
          searchable
          clearable
          data={data}
        />
        <h2>lg</h2>
        <CheckSelect
          style={{ width: 240 }}
          size="lg"
          placeholder="请选择"
          searchable
          clearable
          data={data}
        />
      </div>
    </>
  )
}
