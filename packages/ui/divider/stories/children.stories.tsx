import React from 'react'
import Divider from '../src'

export const children = () => {
  return (
    <>
      <h1>带子节点</h1>
      <div className="divider-basic__wrap">
        分割线上方文本
        <Divider>分割线 文字</Divider>
        分割线下方文本
        <br /> 分割线上方文本
        <Divider dashed>分割线文字</Divider>
        分割线下方文本
        <br /> 分割线上方文本
        <Divider orientation="left">分割线靠左内容</Divider>
        分割线下方文本
        <br /> 分割线上方文本
        <Divider orientation="right">分割线靠右内容</Divider>
        分割线下方文本
        <br /> 分割线上方文本
        <Divider orientation="left" dashed orientationMargin="0.3">
          分割线左侧距离占比30%
        </Divider>
        分割线下方文本
      </div>
    </>
  )
}
