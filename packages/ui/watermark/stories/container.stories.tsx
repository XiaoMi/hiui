import React, { useState } from 'react'
import Watermark from '../src'
import { Button } from '@hi-ui/button'

/**
 * @title 指定容器
 * @desc 指定要挂载水印的容器位置
 */
export const Container = () => {
  const [mounted, setMounted] = useState<any>(false)

  return (
    <>
      <h1>Container</h1>
      <div className="watermark-container__wrap" style={{ height: 402, minWidth: 660 }}>
        <Button
          type="primary"
          onClick={() => {
            setMounted(!mounted)
          }}
        >
          {mounted ? '取消挂载水印到全局' : '挂载水印到全局'}
        </Button>
      </div>
      {mounted ? (
        <Watermark
          style={{
            pointerEvents: 'none',
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 2048,
          }}
          content={['HiUI', '做中台，就用 HiUI']}
          container={document.body}
          allowCopy={true}
        />
      ) : null}
    </>
  )
}
