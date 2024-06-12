import React from 'react'
import Divider from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="divider-basic__wrap">
        分割线上方文本
        <Divider></Divider>
        分割线下方文本
      </div>
    </>
  )
}
