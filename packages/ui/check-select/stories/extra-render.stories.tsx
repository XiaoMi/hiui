import React, { useState } from 'react'
import CheckSelect from '../src'

/**
 * @title 自定义头尾
 */
export const ExtraRender = () => {
  const [data] = useState([
    { title: '电视', id: '3', disabled: false },
    { title: '手机', id: '2' },
    { title: '笔记本', id: '4', disabled: false },
    { title: '生活周边', id: '5' },
    { title: '办公', id: '6' },
  ])

  return (
    <>
      <h1>ExtraRender</h1>
      <div className="check-select-extra-render">
        <CheckSelect
          style={{ width: 240 }}
          clearable={false}
          data={data}
          renderExtraHeader={() => <div style={{ padding: '10px 14px' }}>customer header</div>}
          renderExtraFooter={() => 'customer footer'}
        />
      </div>
    </>
  )
}
