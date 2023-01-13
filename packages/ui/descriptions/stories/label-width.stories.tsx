import React from 'react'
import Descriptions from '../src'

/**
 * @title 固定label宽度
 * @desc 根据实际情况配置label宽度，一个页面中label宽度应该保持一致
 */
export const LabelWidth = () => {
  return (
    <>
      <h1>label设置固定宽度</h1>
      <div className="descriptions-basic__wrap">
        <Descriptions labelPlacement="right">
          <Descriptions.Item label="名字" labelWidth="100px">
            张三
          </Descriptions.Item>
          <Descriptions.Item label="Phone">15311969622</Descriptions.Item>
          <Descriptions.Item label="Address">北京天安门</Descriptions.Item>
          <Descriptions.Item label="Money1">100000000</Descriptions.Item>
          <Descriptions.Item label="Money2" colSpan={2}>
            100000022220
          </Descriptions.Item>
          <Descriptions.Item label="Money3">
            <div>test</div>
          </Descriptions.Item>
          <Descriptions.Item label="Money4">1000000222201133</Descriptions.Item>
        </Descriptions>
        <Descriptions labelPlacement="right">
          <Descriptions.Item label="label名称很长很长" labelWidth="100px" labelPlacement="left">
            张三
          </Descriptions.Item>
          <Descriptions.Item label="Phone">15311969622</Descriptions.Item>
          <Descriptions.Item label="Address">北京天安门</Descriptions.Item>
          <Descriptions.Item label="Money1">100000000</Descriptions.Item>
          <Descriptions.Item label="Money2" colSpan={2}>
            100000022220
          </Descriptions.Item>
          <Descriptions.Item label="Money3">
            <div>test</div>
          </Descriptions.Item>
          <Descriptions.Item label="Money4">1000000222201133</Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
