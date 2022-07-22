import React from 'react'
import Input from '../src'

/**
 * @title 自动聚焦
 */
export const AutoFocus = () => {
  return (
    <>
      <h1>AutoFocus for Input</h1>
      <div className="input-auto-focus__wrap">
        <Input autoFocus placeholder="请输入"></Input>
      </div>
    </>
  )
}
