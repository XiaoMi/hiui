import React from 'react'
import Collapse from '../src'

/**
 * @title 基础用法
 * @desc 可以同时展开多个面板，对垂直空间没有特别限制
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="collapse-basic__wrap">
        <Collapse defaultActiveId={['2', '3']} arrowPlacement="left">
          <Collapse.Panel title="小米手机" id="1" disabled>
            <div
              style={{
                backgroundColor: '#f5f7fa',
                textAlign: 'center',
                padding: 32,
                color: '#1f2733',
              }}
            >
              我是小米手机的内容
            </div>
          </Collapse.Panel>
          <Collapse.Panel title="红米手机" id="2">
            <div
              style={{
                backgroundColor: '#f5f7fa',
                textAlign: 'center',
                padding: 32,
                color: '#1f2733',
              }}
            >
              我是红米手机的内容
            </div>
          </Collapse.Panel>
          <Collapse.Panel title="小米笔记本" id="3">
            <div
              style={{
                backgroundColor: '#f5f7fa',
                textAlign: 'center',
                padding: 32,
                color: '#1f2733',
              }}
            >
              我是小米笔记本的内容
            </div>
          </Collapse.Panel>
          <Collapse.Panel title="小米 AI" id="4">
            <div
              style={{
                backgroundColor: '#f5f7fa',
                textAlign: 'center',
                padding: 32,
                color: '#1f2733',
              }}
            >
              我是小米 AI 的内容
            </div>
          </Collapse.Panel>
        </Collapse>
      </div>
    </>
  )
}
