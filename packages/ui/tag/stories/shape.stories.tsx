import React from 'react'
import Tag from '../src'

/**
 * @title 不同形状
 */
export const Shape = () => {
  return (
    <>
      <h1>Tag Shape</h1>
      <div>
        <div style={{ fontSize: 16, fontWeight: 500, margin: '20px 0 8px 0' }}>square 方型</div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Tag shape="square" type="warning" appearance="filled">
            待审批
          </Tag>
          <Tag shape="square" type="primary" appearance="filled">
            审批中
          </Tag>
          <Tag shape="square" type="success" appearance="filled">
            已通过
          </Tag>
          <Tag shape="square" type="danger" appearance="filled">
            已驳回
          </Tag>
          <Tag shape="square" type="default" appearance="filled">
            待审批
          </Tag>
        </div>
        <br />
        <div style={{ display: 'flex', gap: 8 }}>
          <Tag shape="square" type="warning" appearance={'line'}>
            待审批
          </Tag>
          <Tag shape="square" type="primary" appearance={'line'}>
            审批中
          </Tag>
          <Tag shape="square" type="success" appearance={'line'}>
            已通过
          </Tag>
          <Tag shape="square" type="danger" appearance={'line'}>
            已驳回
          </Tag>
          <Tag shape="square" type="default" appearance={'line'}>
            待审批
          </Tag>
        </div>
        <br />
        <div style={{ display: 'flex', gap: 8 }}>
          <Tag shape="square" type="warning" appearance="solid">
            待审批
          </Tag>
          <Tag shape="square" type="primary" appearance="solid">
            审批中
          </Tag>
          <Tag shape="square" type="success" appearance="solid">
            已通过
          </Tag>
          <Tag shape="square" type="danger" appearance="solid">
            已驳回
          </Tag>
          <Tag shape="square" type="default" appearance="solid">
            待审批
          </Tag>
        </div>
        <div style={{ fontSize: 16, fontWeight: 500, margin: '20px 0 8px 0' }}>round 圆润型</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Tag shape="round" type="warning" appearance="filled">
            待审批
          </Tag>
          <Tag shape="round" type="primary" appearance="filled">
            审批中
          </Tag>
          <Tag shape="round" type="success" appearance="filled">
            已通过
          </Tag>
          <Tag shape="round" type="danger" appearance="filled">
            已驳回
          </Tag>
          <Tag shape="round" type="default" appearance="filled">
            待审批
          </Tag>
        </div>
        <br />
        <div style={{ display: 'flex', gap: 8 }}>
          <Tag shape="round" type="warning" appearance={'line'}>
            待审批
          </Tag>
          <Tag shape="round" type="primary" appearance={'line'}>
            审批中
          </Tag>
          <Tag shape="round" type="success" appearance={'line'}>
            已通过
          </Tag>
          <Tag shape="round" type="danger" appearance={'line'}>
            已驳回
          </Tag>
          <Tag shape="round" type="default" appearance={'line'}>
            待审批
          </Tag>
        </div>
        <br />
        <div style={{ display: 'flex', gap: 8 }}>
          <Tag shape="round" type="warning" appearance="solid">
            待审批
          </Tag>
          <Tag shape="round" type="primary" appearance="solid">
            审批中
          </Tag>
          <Tag shape="round" type="success" appearance="solid">
            已通过
          </Tag>
          <Tag shape="round" type="danger" appearance="solid">
            已驳回
          </Tag>
          <Tag shape="round" type="default" appearance="solid">
            待审批
          </Tag>
        </div>
      </div>
    </>
  )
}
