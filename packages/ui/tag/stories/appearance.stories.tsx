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
      <h2>Filled 面性</h2>
      <div style={{ display: 'flex', gap: 8 }}>
        <Tag type="default" appearance="filled">
          默认色
        </Tag>
        <Tag type="primary" appearance="filled">
          主题色
        </Tag>
        <Tag type="success" appearance="filled">
          成功色
        </Tag>
        <Tag type="warning" appearance="filled">
          警告色
        </Tag>
        <Tag type="danger" appearance="filled">
          危险色
        </Tag>
        <Tag type="yellow" appearance="filled">
          黄色
        </Tag>
        <Tag type="ultramarine" appearance="filled">
          深蓝色
        </Tag>
        <Tag type="skyblue" appearance="filled">
          天蓝色
        </Tag>
        <Tag type="purple" appearance="filled">
          紫色
        </Tag>
        <Tag type="rosered" appearance="filled">
          玫瑰红
        </Tag>
      </div>
      <h2>line 线性</h2>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Tag type="default" appearance="line">
          默认色
        </Tag>
        <Tag type="primary" appearance="line">
          主题色
        </Tag>
        <Tag type="success" appearance="line">
          成功色
        </Tag>
        <Tag type="warning" appearance="line">
          警告色
        </Tag>
        <Tag type="danger" appearance="line">
          危险色
        </Tag>
        <Tag type="yellow" appearance="line">
          黄色
        </Tag>
        <Tag type="ultramarine" appearance="line">
          深蓝色
        </Tag>
        <Tag type="skyblue" appearance="line">
          天蓝色
        </Tag>
        <Tag type="purple" appearance="line">
          紫色
        </Tag>
        <Tag type="rosered" appearance="line">
          玫瑰红
        </Tag>
      </div>
      <h2>solid 实心</h2>
      <div style={{ display: 'flex', gap: 8 }}>
        <Tag type="default" appearance="solid">
          默认色
        </Tag>
        <Tag type="primary" appearance="solid">
          主题色
        </Tag>
        <Tag type="success" appearance="solid">
          成功色
        </Tag>
        <Tag type="warning" appearance="solid">
          警告色
        </Tag>
        <Tag type="danger" appearance="solid">
          危险色
        </Tag>
        <Tag type="yellow" appearance="solid">
          黄色
        </Tag>
        <Tag type="ultramarine" appearance="solid">
          深蓝色
        </Tag>
        <Tag type="skyblue" appearance="solid">
          天蓝色
        </Tag>
        <Tag type="purple" appearance="solid">
          紫色
        </Tag>
        <Tag type="rosered" appearance="solid">
          玫瑰红
        </Tag>
      </div>
    </>
  )
}
