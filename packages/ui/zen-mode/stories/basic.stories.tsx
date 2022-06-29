import React, { useState } from 'react'
import ZenMode from '../src'
import { Button } from '@hi-ui/button'

/**
 * @title 基础用法
 */
export const Basic = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <h1>Basic for ZenMode</h1>
      <div className="zen-mode-basic__wrap">
        <Button
          style={{ marginBottom: 10 }}
          onClick={() => {
            setVisible(true)
          }}
        >
          开启禅模式
        </Button>

        <ZenMode
          visible={visible}
          onBack={() => {
            setVisible(false)
          }}
          toolbar={[
            <Button
              key="btn"
              onClick={() => {
                setVisible(false)
              }}
            >
              退出演示
            </Button>,
          ]}
        >
          <div
            style={{ fontSize: 14, textAlign: 'center', backgroundColor: '#F5F7FA', padding: 16 }}
          >
            <div style={{ fontWeight: 600, lineHeight: '32px' }}>我是大标题</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
            <div>我是禅模式测试的文本内容</div>
          </div>
        </ZenMode>
      </div>
    </>
  )
}
