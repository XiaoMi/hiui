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
          <BackTop
            style={{ position: 'absolute', right: 50, bottom: 112 }}
            container={() => document.getElementById('back-top_custom')}
            onClick={() => {
              Tooltip.close('back-top-custom')
            }}
            onMouseEnter={(evt) => {
              Tooltip.open(evt.currentTarget, {
                key: 'back-top-custom',
                title: '回到顶部',
                placement: 'left',
              })
            }}
            onMouseLeave={() => {
              Tooltip.close('back-top-custom')
            }}
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
          <div
            id="back-top_custom"
            style={{ position: 'relative', height: 400, overflowY: 'scroll' }}
          >
            {Array.from({ length: 10 }, (_, index) => (
              <div key={index} style={{ padding: 30, background: '#f2f3f7' }}>
                页面内容{index}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
