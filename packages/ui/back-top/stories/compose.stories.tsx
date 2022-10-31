import React from 'react'
import { ScanOutlined, MessageOutlined } from '@hi-ui/icons'
import BackTop from '../src'

/**
 * @title 组合使用
 * @desc 和其他元素组合使用
 */
export const Compose = () => {
  return (
    <>
      <h1>组合用法</h1>
      <div className="back-top-basic__wrap">
        <div style={{ position: 'relative', height: 400 }}>
          <div
            style={{
              position: 'absolute',
              right: 32,
              bottom: 88,
              width: 40,
              zIndex: 9,
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
                background: '#fff',
                color: '#5f6a7a',
                fontSize: 20,
                boxShadow: '0 12px 24px 8px rgba(31, 39, 51, 0.1)',
              }}
            >
              <ScanOutlined />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#fff',
                color: '#5f6a7a',
                fontSize: 20,
                boxShadow: '0 12px 24px 8px rgba(31, 39, 51, 0.1)',
                marginTop: 16,
              }}
            >
              <MessageOutlined />
            </div>
          </div>
          <BackTop
            shape="circle"
            style={{ position: 'absolute' }}
            container={() => document.getElementById('back-top_compose')}
          />
          <div
            id="back-top_compose"
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
