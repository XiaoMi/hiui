import React, { useState } from 'react'
import ZenMode from '../src'
import { Button } from '@hi-ui/button'

export const Basic = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <h1>Basic for ZenMode</h1>
      <div className="zen-mode-basic__wrap">
        <Button
          onClick={() => {
            setVisible(true)
          }}
        >
          开启禅模式
        </Button>
        <ZenMode
          visible={visible}
          onReturn={() => {
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
          <div>
            禅模式测试禅模式测试禅模式测试禅模式测试禅模式测试禅模式测试禅模式测试禅模式测试
          </div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
          <div>禅模式测试禅模式测试</div>
        </ZenMode>
      </div>
    </>
  )
}
