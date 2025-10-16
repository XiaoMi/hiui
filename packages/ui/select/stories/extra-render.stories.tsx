import React, { useState } from 'react'
import Select from '../src'

/**
 * @title 自定义头尾
 */
export const ExtraRender = () => {
  const [data] = useState([
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
      <h1>ExtraRender</h1>
      <div className="select-extra-render">
        <Select
          style={{ width: 240 }}
          clearable={false}
          data={data}
          renderExtraHeader={() => <div style={{ padding: '10px 14px' }}>custom header</div>}
          renderExtraFooter={() => 'custom footer'}
        />
      </div>
    </>
  )
}
