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
        <Tag type="warning">待审批</Tag>
        <Tag type="primary">审批中</Tag>
        <Tag type="success">已通过</Tag>
        <Tag type="danger">已驳回</Tag>
        <Tag type="default">待审批</Tag>
      </div>
    </>
  )
}
