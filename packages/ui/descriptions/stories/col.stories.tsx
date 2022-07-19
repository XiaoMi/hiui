import React from 'react'
import Descriptions from '../src'

/**
 * @title 自定义列数
 * @desc 支持一栏至四栏平均分布
 */
export const Col = () => {
  return (
    <>
      <h1>自定义列数</h1>
      <div className="descriptions-basic__wrap">
        <Descriptions column={2}>
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
