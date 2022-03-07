import React from 'react'
import Result from '../src'
import Button from '@hi-ui/button'

export const Complete = () => {
  return (
    <>
      <h1>完整功能</h1>
      <div className="result-basic__wrap" style={{ width: '760px' }}>
        <Result
          type="net-error"
          title="网络连接失败"
          subTitle="这是对网络连接失败的说明文案"
          extra={[
            <Button key="refresh">刷新</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        >
          <div
            style={{
              whiteSpace: 'pre-wrap',
              padding: '30px',
              background: '#f2f4f7',
              boxSizing: 'border-box',
              fontSize: '14px',
              color: '#1F2733',
            }}
          >
            {'请尝试：\n\n1. 检查您的电脑网络是否正常\n2. 关闭 Wi-Fi 重新链接'}
          </div>
        </Result>
      </div>
    </>
  )
}
