import React from 'react'
import Divider from '../src'

export const Color = () => {
  return (
    <>
      <h1>分割线颜色</h1>
      <div className="divider-basic__wrap">
        分割线上方文本
        <Divider color="#ff3f47"></Divider>
        分割线下方文本
      </div>
    </>
  )
}
