import React from 'react'
import Tag from '../src'

/**
 * @title 基础用法
 * @desc 标签的信息重要级别高，识别度较高
 */
export const Basic = () => {
  return (
    <>
      <h1>Tag Basic</h1>
      <div style={{ display: 'flex', gap: 8 }}>
        <Tag type="default">默认色</Tag>
        <Tag type="primary">主题色</Tag>
        <Tag type="success">成功色</Tag>
        <Tag type="warning">警告色</Tag>
        <Tag type="danger">危险色</Tag>
        <Tag type="yellow">黄色</Tag>
        <Tag type="ultramarine">深蓝色</Tag>
        <Tag type="skyblue">天蓝色</Tag>
        <Tag type="purple">紫色</Tag>
        <Tag type="rosered">玫瑰红</Tag>
      </div>
    </>
  )
}
