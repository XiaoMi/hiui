import React from 'react'
import Descriptions from '../src'

export const Basic = () => {
  return (
    <>
      <div className="descriptions-basic__wrap" style={{ minWidth: 1250 }}>
        <Descriptions>
          <Descriptions.Item label="名字">张三</Descriptions.Item>
          <Descriptions.Item label="Phone">15311969622</Descriptions.Item>
          <Descriptions.Item label="Address">北京天安门</Descriptions.Item>
          <Descriptions.Item label="Money1">100000000</Descriptions.Item>
          <Descriptions.Item label="Money2">100000022220</Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
