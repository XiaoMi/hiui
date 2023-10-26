import React from 'react'
import TextArea from '../src'

/**
 * @title 禁用状态
 */
export const Disabled = () => {
  return (
    <>
      <h1>Disabled</h1>
      <div className="textarea-disabled__wrap">
        <h2>普通</h2>
        <div>
          <TextArea appearance="line" disabled placeholder="请输入"></TextArea>
          <br />
          <br />
          <TextArea appearance="unset" disabled placeholder="请输入"></TextArea>
          <br />
          <br />
          <TextArea appearance="filled" disabled placeholder="请输入"></TextArea>
        </div>
        <br />
        <h2>Invalid</h2>
        <div>
          <TextArea invalid appearance="line" disabled placeholder="请输入"></TextArea>
          <br />
          <br />
          <TextArea invalid appearance="unset" disabled placeholder="请输入"></TextArea>
          <br />
          <br />
          <TextArea invalid appearance="filled" disabled placeholder="请输入"></TextArea>
        </div>
        <br />
        <h2>有值</h2>
        <div>
          <TextArea value="输入值" appearance="line" disabled placeholder="请输入"></TextArea>
          <br />
          <br />
          <TextArea value="输入值" appearance="unset" disabled placeholder="请输入"></TextArea>
          <br />
          <br />
          <TextArea value="输入值" appearance="filled" disabled placeholder="请输入"></TextArea>
        </div>
      </div>
    </>
  )
}
