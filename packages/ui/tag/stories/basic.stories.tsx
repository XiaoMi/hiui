import React, { useState } from 'react'

import Tag from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Tag colors</h1>
      <div style={{ display: 'flex' }}>
        <Tag type="warning">待审批</Tag>
        <Tag type="primary">审批中</Tag>
        <Tag type="success">已通过</Tag>
        <Tag type="danger">已驳回</Tag>
        <Tag type="default">待审批</Tag>
      </div>
      <div style={{ display: 'flex', marginTop: '32px' }}>
        <Tag type="warning" appearance="solid">
          待审批
        </Tag>
        <Tag type="primary" appearance="solid">
          审批中
        </Tag>
        <Tag type="success" appearance="solid">
          已通过
        </Tag>
        <Tag type="danger" appearance="solid">
          已驳回
        </Tag>
        <Tag type="default" appearance="solid">
          待审批
        </Tag>
      </div>
      <h1>Tag size</h1>
      <h2>Mini</h2>
      <Tag size="mini">一个标签</Tag>
      <h2>Small</h2>
      <Tag size="small">一个标签</Tag>
      <h2>Medium</h2>
      <Tag size="medium">一个标签</Tag>
      <h1>Custom color</h1>
      <div style={{ display: 'flex' }}>
        <Tag color="#48D4CF">color #48D4CF</Tag>
        <Tag background="#48D4CF" appearance="solid">
          background #48D4CF
        </Tag>
      </div>
      <h1>Closeable</h1>
      <div style={{ display: 'flex' }}>
        <Tag appearance="default" type="primary" closeable>
          Closeable default
        </Tag>
        <Tag appearance="default" closeable>
          Closeable default
        </Tag>
        <Tag appearance="solid" type="primary" closeable>
          Closeable solid
        </Tag>
        <Tag appearance="solid" closeable>
          Closeable solid
        </Tag>
      </div>
    </>
  )
}
