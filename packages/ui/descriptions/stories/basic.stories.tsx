import React from 'react'
import Descriptions from '../src'

/**
 * @title 基础用法
 * @desc Descriptions 结合 Descriptions.Item 完成描述列表的动态配置
 */
export const Basic = () => {
  return (
    <>
      <h1>基础用法</h1>
      <div className="descriptions-basic__wrap">
        <Descriptions>
          <Descriptions.Item label="名字">张三</Descriptions.Item>
          <Descriptions.Item label="Phone">15311969622</Descriptions.Item>
          <Descriptions.Item label="Address">北京天安门</Descriptions.Item>
          <Descriptions.Item label="Money1">100000000</Descriptions.Item>
          <Descriptions.Item label="Money2">100000022220</Descriptions.Item>
          <Descriptions.Item label="Money3">
            <div>test</div>
          </Descriptions.Item>
          <Descriptions.Item label="Money4">1000000222201133</Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
