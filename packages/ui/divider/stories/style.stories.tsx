import React from 'react'
import Divider from '../src'

export const Style = () => {
  return (
    <>
      <h1>自定义样式</h1>
      <div className="divider-basic__wrap">
        分割线上方文本
        <Divider wrapperStyle={{ marginTop: '10px', marginBottom: '10px' }}></Divider>
        分割线下方文本
      </div>
    </>
  )
}
