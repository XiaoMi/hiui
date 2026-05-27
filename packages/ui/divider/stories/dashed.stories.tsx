import React from 'react'
import Divider from '../src'

export const Dashed = () => {
  return (
    <>
      <h1>虚线</h1>
      <div className="divider-basic__wrap">
        虚线上方文本
        <Divider dashed></Divider>
        虚线下方文本
      </div>
    </>
  )
}
