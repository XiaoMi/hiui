import React from 'react'
import Tag from '../src'

/**
 * @title 不同尺寸
 */
export const Size = () => {
  return (
    <>
      <h1>Tag Size</h1>
      <div>
        <div style={{ fontSize: 16, fontWeight: 500, margin: '20px 0 8px 0' }}>sm</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Tag size="sm" type="warning" appearance="filled">
            待审批
          </Tag>
          <Tag size="sm" type="primary" appearance="filled">
            审批中
          </Tag>
          <Tag size="sm" type="success" appearance="filled">
            已通过
          </Tag>
          <Tag size="sm" type="danger" appearance="filled">
            已驳回
          </Tag>
          <Tag size="sm" type="default" appearance="filled">
            待审批
          </Tag>
        </div>
        <div style={{ fontSize: 16, fontWeight: 500, margin: '20px 0 8px 0' }}>md</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Tag size="md" type="warning" appearance="filled">
            待审批
          </Tag>
          <Tag size="md" type="primary" appearance="filled">
            审批中
          </Tag>
          <Tag size="md" type="success" appearance="filled">
            已通过
          </Tag>
          <Tag size="md" type="danger" appearance="filled">
            已驳回
          </Tag>
          <Tag size="md" type="default" appearance="filled">
            待审批
          </Tag>
        </div>
        <div style={{ fontSize: 16, fontWeight: 500, margin: '20px 0 8px 0' }}>lg</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Tag size="lg" type="warning" appearance="filled">
            待审批
          </Tag>
          <Tag size="lg" type="primary" appearance="filled">
            审批中
          </Tag>
          <Tag size="lg" type="success" appearance="filled">
            已通过
          </Tag>
          <Tag size="lg" type="danger" appearance="filled">
            已驳回
          </Tag>
          <Tag size="lg" type="default" appearance="filled">
            待审批
          </Tag>
        </div>
      </div>
    </>
  )
}
