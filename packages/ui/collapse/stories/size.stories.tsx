import React from 'react'
import Collapse from '../src'

/**
 * @title 设置头部大小
 */
export const Size = () => {
  return (
    <>
      <h1>Size</h1>
      <div className="collapse-size__wrap">
        <Collapse defaultActiveId={['2', '3']} arrowPlacement="left" size="lg">
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
