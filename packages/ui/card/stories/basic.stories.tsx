import React from 'react'
import Card from '../src'

/**
 * @title 基础用法
 * @desc 用卡片封装独立的信息实体，如模块、功能、项目、应用等，或还原实际生活中的卡片应用
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="card-basic__wrap">
        <Card title="标题">
          <div
            style={{
              height: 174,
              backgroundColor: '#F5F8FC',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            此处展示卡片内容
          </div>
        </Card>
        <br />
        <br />
        <Card title="标题" showHeaderDivider>
          <div
            style={{
              height: 174,
              backgroundColor: '#F5F8FC',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            此处展示卡片内容
          </div>
        </Card>
      </div>
    </>
  )
}
