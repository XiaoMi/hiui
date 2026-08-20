import React from 'react'
import Divider from '../src'

export const Vertical = () => {
  return (
    <>
      <h1>垂直分割线</h1>
      <div className="divider-basic__wrap">
        分割线左侧文本
        <Divider type="vertical"></Divider>
        分割线右侧文本
        <br />
        分割线左侧文本
        <Divider type="vertical" verticalMarginInline="40"></Divider>
        分割线右侧文本
      </div>
    </>
  )
}
