import React from 'react'
import Input from '../src'

export const Trim = () => {
  return (
    <>
      <h1>Trim</h1>
      <div className="input-trim__wrap">
        <Input
          placeholder="请输入"
          onChange={(e) => console.log('change', e.target.value)}
          trimValueOnBlur
        ></Input>
        <br />
        <Input disabled placeholder="请输入"></Input>
      </div>
    </>
  )
}
