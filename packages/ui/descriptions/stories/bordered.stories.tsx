import React from 'react'
import Descriptions from '../src'

/**
 * @title 带边框的
 * @desc 设置 `appearance` 控制描述列表组件的展现形态
 */
export const Bordered = () => {
  return (
    <>
      <h1>带边框的</h1>
      <div className="descriptions-basic__wrap">
        <Descriptions appearance="table">
          <Descriptions.Item label="名字">张三</Descriptions.Item>
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
