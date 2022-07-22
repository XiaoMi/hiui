import React from 'react'
import Descriptions from '../src'

/**
 * @title 上下布局
 * @desc 支持 label 和 content 上下布局形式进行展示
 */
export const Vertical = () => {
  return (
    <>
      <h1>垂直列表</h1>
      <div className="descriptions-basic__wrap">
        <Descriptions placement="vertical">
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
