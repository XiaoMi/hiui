import React from 'react'
import Tag from '../src'

/**
 * @title 不同UI风格
 * @desc UI风格包括线性、面性、实心三种
 */
export const Appearance = () => {
  return (
    <>
      <h1>Tag Appearance</h1>
      <h3>Filled 面性</h3>
      <div style={{ display: 'flex', gap: 8 }}>
        <Tag type="warning" appearance="filled">
          待审批
        </Tag>
        <Tag type="primary" appearance="filled">
          审批中
        </Tag>
        <Tag type="success" appearance="filled">
          已通过
        </Tag>
        <Tag type="danger" appearance="filled">
          已驳回
        </Tag>
        <Tag type="default" appearance="filled">
          待审批
        </Tag>
      </div>
      <h3>line 线性</h3>
      <div style={{ display: 'flex', gap: '8px' }}>
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
      <h3>solid 实心</h3>
      <div style={{ display: 'flex', gap: 8 }}>
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
    </>
  )
}
