import React from 'react'
import Input from '../src'

export const Disabled = () => {
  return (
    <>
      <h1>Disabled for Input</h1>
      <div className="input-disabled__wrap">
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
        <br />
        <div>
          <Input invalid appearance="line" disabled placeholder="请输入"></Input>
          <br />
          <br />
          <Input invalid appearance="unset" disabled placeholder="请输入"></Input>
          <br />
          <br />
          <Input invalid appearance="filled" disabled placeholder="请输入"></Input>
        </div>
      </div>
    </>
  )
}
