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
        <h2>常规</h2>
        <Collapse defaultActiveId={['1']} arrowPlacement="left" size="md">
          <Collapse.Panel title="红米手机" id="1">
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
        </Collapse>
        <h2>大尺寸</h2>
        <Collapse defaultActiveId={['2']} arrowPlacement="left" size="lg">
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
        </Collapse>
      </div>
    </>
  )
}
