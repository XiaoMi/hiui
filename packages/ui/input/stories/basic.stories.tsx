import React from 'react'
import Input from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic for Input</h1>
      <div className="input-basic__wrap">
        <Input placeholder="请输入"></Input>
        <br />
        <Input disabled placeholder="请输入"></Input>
      </div>
    </>
  )
}
