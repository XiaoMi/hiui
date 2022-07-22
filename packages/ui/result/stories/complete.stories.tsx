import React from 'react'
import Result, { RESULT_IMAGE_NET_ERROR } from '../src'
import Button from '@hi-ui/button'

/**
 * @title 带按钮
 * @desc 通过 `children` 配置补充的操作或建议提示
 */
export const Complete = () => {
  return (
    <>
      <h1>完整功能</h1>
      <div className="result-basic__wrap">
        <Result
          image={RESULT_IMAGE_NET_ERROR}
          title="网络连接失败"
          content="这是对网络连接失败的说明文案"
        >
          <div>
            {[
              <Button key="refresh">刷新</Button>,
              <Button type="primary" key="back">
                返回
              </Button>,
            ]}
            <div
              style={{
                whiteSpace: 'pre-wrap',
                marginTop: '30px',
                padding: '30px',
                background: '#f2f4f7',
                boxSizing: 'border-box',
                fontSize: '14px',
                color: '#1F2733',
                textAlign: 'left',
              }}
            >
              <div>请尝试：</div>
              <div>1. 检查您的电脑网络是否正常</div>
              <div>2. 关闭 Wi-Fi 重新链接</div>
            </div>
          </div>
        </Result>
      </div>
    </>
  )
}
