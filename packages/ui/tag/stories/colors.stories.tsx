import React from 'react'
import Tag from '../src'

/**
 * @title 不同颜色
 */
export const Colors = () => {
  return (
    <>
      <h1>Tag colors</h1>
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
