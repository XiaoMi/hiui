import React from 'react'
import Input from '../src'

/**
 * @title 受控
 */
export const Controlled = () => {
  const [value, setValue] = React.useState('我是输入文本')

  return (
    <>
      <h1>Controlled for Input</h1>
      <div className="input-controlled__wrap">
        <div style={{ fontSize: 14 }}>输入值：{value}</div>
        <Input
          style={{ marginTop: 8 }}
          placeholder="请输入"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </>
  )
}
