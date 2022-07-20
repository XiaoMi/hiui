import React from 'react'
import Input from '../src'

/**
 * @title 特殊格式
 * @desc 满足不同业务场景的特殊格式
 */
export const Type = () => {
  return (
    <>
      <h1>特殊格式</h1>
      <div className="input-type__wrap">
        <h2>身份证</h2>
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
        <h2>手机号</h2>
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
        <h2>金额</h2>
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
        <h2>银行卡</h2>
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
