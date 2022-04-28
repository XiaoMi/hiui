import React from 'react'
import Input from '../src'

/**
 * @title 自动 Trim
 */
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
        <br />
        <Input disabled placeholder="请输入"></Input>
      </div>
    </>
  )
}
