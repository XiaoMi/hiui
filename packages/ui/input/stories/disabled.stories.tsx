import React from 'react'
import Input from '../src'

/**
 * @title 禁用状态
 */
export const Disabled = () => {
  return (
    <>
      <h1>Disabled for Input</h1>
      <div className="input-disabled__wrap">
        <h2>普通</h2>
        <div>
          <Input appearance="line" disabled placeholder="请输入"></Input>
          <br />
          <br />
          <Input appearance="unset" disabled placeholder="请输入"></Input>
          <br />
          <br />
          <Input appearance="filled" disabled placeholder="请输入"></Input>
        </div>
        <br />
        <h2>Invalid</h2>
        <div>
          <Input invalid appearance="line" disabled placeholder="请输入"></Input>
          <br />
          <br />
          <Input invalid appearance="unset" disabled placeholder="请输入"></Input>
          <br />
          <br />
          <Input invalid appearance="filled" disabled placeholder="请输入"></Input>
        </div>
        <br />
        <h2>有值</h2>
        <div>
          <Input clearable value="输入值" appearance="line" disabled placeholder="请输入"></Input>
          <br />
          <br />
          <Input clearable value="输入值" appearance="unset" disabled placeholder="请输入"></Input>
          <br />
          <br />
          <Input clearable value="输入值" appearance="filled" disabled placeholder="请输入"></Input>
        </div>
      </div>
    </>
  )
}
