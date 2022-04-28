import React from 'react'
import Input from '../src'

/**
 * @title 受控
 */
export const Controlled = () => {
  const [value, setValue] = React.useState('Controlled')

  return (
    <>
      <h1>Controlled for Input</h1>
      <div className="input-controlled__wrap">
        <span>{value}</span>
        <Input
          placeholder="请输入"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        ></Input>
        <br />
        <br />
        <Input placeholder="请输入" defaultValue="defaultValue"></Input>
      </div>
    </>
  )
}
