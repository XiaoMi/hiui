import React from 'react'
import CheckSelect from '../src'

/**
 * @title 不同尺寸
 */
export const Size = () => {
  const [data] = React.useState([
    { title: '手机', id: '1' },
    { title: '电脑', id: '2' },
    { title: '电视', id: '3' },
    { title: '平板', id: '4' },
    { title: '冰箱', id: '5' },
    { title: '洗衣机', id: '6' },
    { title: '空调', id: '7' },
    { title: '其它', id: '8' },
  ])

  return (
    <>
      <h1>Size</h1>
      <div className="check-select-size__wrap">
        <h2>xs</h2>
        <CheckSelect
          style={{ width: 240 }}
          size="xs"
          placeholder="请选择"
          searchable
          clearable
          data={data}
        />
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
