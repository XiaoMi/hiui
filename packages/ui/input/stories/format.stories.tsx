import React from 'react'
import Input from '../src'

export const Format = () => {
  return (
    <>
      <h1>特殊格式</h1>
      <div className="input-format__wrap">
        <p>身份证</p>
        <Input
          type="id"
          style={{ width: 250 }}
          placeholder="请输入"
          clearable
          trimValueOnBlur
          onChange={(event, value) => {
            console.log(event.target.value, value)
          }}
        />
        <br />
        <br />
        <p>手机号</p>
        <Input
          type="tel"
          style={{ width: 250 }}
          placeholder="请输入"
          clearable
          trimValueOnBlur
          onChange={(event, value) => {
            console.log(event.target.value, value)
          }}
        />
        <br />
        <br />
        <p>金额</p>
        <Input
          type="amount"
          style={{ width: 250 }}
          placeholder="请输入"
          clearable
          trimValueOnBlur
          onChange={(event, value) => {
            console.log(event.target.value, value)
          }}
        />
        <br />
        <br />
        <p>银行卡</p>
        <Input
          type="card"
          style={{ width: 250 }}
          placeholder="请输入"
          clearable
          trimValueOnBlur
          onChange={(event, value) => {
            console.log(event.target.value, value)
          }}
        />
      </div>
    </>
  )
}
