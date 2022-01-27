import React, { useState } from 'react'

import Tag from '../src'

export const Basic = () => {
  const [testValue1, setTestValue1] = useState('test-value')
  const [testValue2, setTestValue2] = useState('test-value')
  const [maxEditableValue, setMaxEditableValue] = useState(
    'max 180px editable (placeholder1 placeholder2 placeholder3 placeholder4)'
  )
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
        <Tag type="warning" appearance={'line'}>
          待审批
        </Tag>
        <Tag type="primary" appearance={'line'}>
          审批中
        </Tag>
        <Tag type="success" appearance={'line'}>
          已通过
        </Tag>
        <Tag type="danger" appearance={'line'}>
          已驳回
        </Tag>
        <Tag type="default" appearance={'line'}>
          待审批
        </Tag>
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
      <h1>Tag shape</h1>
      <h2>square</h2>
      <Tag>一个标签</Tag>
      <h2>round</h2>
      <Tag shape={'round'}>一个标签</Tag>
      <h1>Tag size</h1>
      <h2>Sm</h2>
      <Tag size="sm">一个标签</Tag>
      <h2>Md</h2>
      <Tag size="md">一个标签</Tag>
      <h2>Lg</h2>
      <Tag size="lg">一个标签</Tag>
      <h1>Custom color</h1>
      <div style={{ display: 'flex' }}>
        <Tag color="#48D4CF">color #48D4CF</Tag>
        <Tag background="#48D4CF" appearance="solid">
          background #48D4CF
        </Tag>
      </div>
      <h1>Closeable</h1>
      <div style={{ display: 'flex' }}>
        <Tag appearance="filled" type="primary" closeable>
          Closeable default
        </Tag>
        <Tag appearance="filled" closeable>
          Closeable default
        </Tag>
        <Tag appearance="solid" type="primary" closeable>
          Closeable solid
        </Tag>
        <Tag appearance="solid" closeable>
          Closeable solid
        </Tag>
      </div>
      <h1>Editable</h1>
      <div style={{ display: 'flex' }}>
        <Tag editable onEdit={setTestValue1} type={'primary'}>
          {testValue1}
        </Tag>
        <Tag appearance={'solid'} editable onEdit={setTestValue2} type={'primary'}>
          {testValue2}
        </Tag>
      </div>
      <h1>Max width</h1>
      <div style={{ display: 'flex' }}>
        <Tag maxWidth={240}>max 240px (placeholder1 placeholder2 placeholder3 placeholder4)</Tag>
        <Tag maxWidth={240} closeable>
          max 240px (placeholder1 placeholder2 placeholder3 placeholder4)
        </Tag>
        <Tag maxWidth={180} editable onEdit={setMaxEditableValue}>
          {maxEditableValue}
        </Tag>
      </div>
    </>
  )
}
