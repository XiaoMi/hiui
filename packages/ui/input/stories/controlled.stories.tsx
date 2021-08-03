import React from 'react'
import Input from '../src'

export const Controlled = () => {
  const [value, setValue] = React.useState('Controlled')

  return (
    <>
      <h1>Controlled for Input</h1>
      <div className="input-controlled__wrap">
        <span>{value}</span>
        <Input placeholder="请输入" value={value} onChange={setValue}></Input>
        <br />
        <Input placeholder="请输入" defaultValue="defaultValue"></Input>
      </div>
    </>
  )
}
