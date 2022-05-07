import React, { useState } from 'react'
import Watermark from '../src'
import { Button } from '@hi-ui/button'

/**
 * @title 指定容器
 */
export const Container = () => {
  const containerState = useState(null)

  return (
    <>
      <h1>Container</h1>
      <div
        style={{
          height: 402,
          width: '100vw',
          textAlign: 'center',
        }}
        ref={containerState[1]}
        className="watermark-container__wrap"
      >
        <Button type="primary" onClick={console.log}>
          测试交互
        </Button>
      </div>
      <Watermark
        density="low"
        style={{ position: 'fixed', pointerEvents: 'none' }}
        content={['HIUI', '做中台，就用 HIUI']}
        logo="https://xiaomi.github.io/hiui/static/img/logo.png?241e0618fe55d933c280e38954edea05"
        container={containerState[0]?.ownerDocument?.body ?? undefined}
        allowCopy={true}
      />
    </>
  )
}
