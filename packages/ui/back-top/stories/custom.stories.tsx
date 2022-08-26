import React from 'react'
import Tooltip from '@hi-ui/tooltip'
import { ToTopOutlined } from '@hi-ui/icons'

import BackTop from '../src'

/**
 * @title 自定义按钮位置和内容
 * @desc 给组件传入样式和children
 */
export const Custom = () => {
  return (
    <>
      <h1>自定义按钮位置和内容</h1>
      <div className="back-top-basic__wrap">
        <div style={{ position: 'relative', height: 400 }}>
          <Tooltip title="回到顶部" placement="left">
            <BackTop
              style={{ position: 'absolute', right: 50, bottom: 112 }}
              container={() => document.getElementById('back-top_custom') as HTMLElement}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  color: '#fff',
                  background: '#237ffa',
                }}
              >
                <ToTopOutlined />
              </div>
            </BackTop>
          </Tooltip>
          <div
            id="back-top_custom"
            style={{ position: 'relative', height: 400, overflowY: 'scroll' }}
          >
            <div style={{ padding: 30, background: '#f3f2f9' }}>页面内容1</div>
            <div style={{ padding: 30, background: '#f3f2f9' }}>页面内容2</div>
            <div style={{ padding: 30, background: '#f3f2f9' }}>页面内容3</div>
            <div style={{ padding: 30, background: '#f3f2f9' }}>页面内容4</div>
            <div style={{ padding: 30, background: '#f3f2f9' }}>页面内容5</div>
            <div style={{ padding: 30, background: '#f3f2f9' }}>页面内容6</div>
            <div style={{ padding: 30, background: '#f3f2f9' }}>页面内容7</div>
            <div style={{ padding: 30, background: '#f3f2f9' }}>页面内容8</div>
            <div style={{ padding: 30, background: '#f3f2f9' }}>页面内容9</div>
            <div style={{ padding: 30, background: '#f3f2f9' }}>页面内容10</div>
          </div>
        </div>
      </div>
    </>
  )
}
