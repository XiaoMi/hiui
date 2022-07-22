import React from 'react'
import Input from '../src'

/**
 * @title 无效状态
 */
export const Invalid = () => {
  return (
    <>
      <h1>Invalid for Input</h1>
      <div className="input-invalid__wrap">
        <div>
          <Input appearance="line" invalid placeholder="请输入"></Input>
          <br />
          <br />
          <Input appearance="unset" invalid placeholder="请输入"></Input>
          <br />
          <br />
          <Input appearance="filled" invalid placeholder="请输入"></Input>
          <br />
          <br />
          <Input appearance="underline" invalid placeholder="请输入"></Input>
        </div>
      </div>
    </>
  )
}
