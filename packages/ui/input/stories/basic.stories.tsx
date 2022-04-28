import React from 'react'
import Input from '../src'

/**
 * @title 基础用法
 * @desc 可获取有限长度的字符串，不折行显示
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic for Input</h1>
      <div className="input-basic__wrap">
        <Input placeholder="请输入" onChange={(e, t) => console.log(e.target.value, t)} />
      </div>
    </>
  )
}
