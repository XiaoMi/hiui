import React from 'react'
import Scrollbar from '../src'

/**
 * @title 基础用法
 * @desc 默认鼠标不再容器内隐藏，x、y轴都展示
 */
export const Basic = () => {
  return (
    <>
      <h1>默认</h1>
      <div className="scrollbar-basic__wrap" style={{ height: 320 }}>
        <Scrollbar>
          <div style={{ height: 640, width: '100%' }}>
            <div style={{ height: 160, background: '#03A9F433' }} />
            <div style={{ height: 160, background: '#00968833' }} />
            <div style={{ height: 160, background: '#FF572233' }} />
            <div style={{ height: 160, background: '#E91E6333' }} />
          </div>
        </Scrollbar>
      </div>
    </>
  )
}
