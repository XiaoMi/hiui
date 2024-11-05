import React, { useRef, useEffect } from 'react'
import Scrollbar from '../src'

/**
 * @title 滚动条固定到屏幕底部
 * @desc 默认不开启
 */
export const Fixed = () => {
  const innerRef = useRef<any>()
  useEffect(() => {
    document.addEventListener('scroll', () => {
      innerRef.current?.updata()
    })
  }, [])
  return (
    <div
      id="outer"
      style={{
        height: '150vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <Scrollbar
        innerRef={innerRef}
        keepVisible
        style={{
          height: 400,
          width: 600,
        }}
        settings={{ isBottomToScreenBottom: true, heightFromBottom: 20 }}
      >
        <div style={{ height: 640, width: '200%' }}>
          <div
            style={{
              height: 160,
              background: 'linear-gradient(90deg,#03A9F433,#03A9F4cc)',
            }}
          />
          <div
            style={{
              height: 160,
              background: 'linear-gradient(90deg,#00968833,#009688cc)',
            }}
          />
          <div
            style={{
              height: 160,
              background: 'linear-gradient(90deg,#FF572233,#FF5722cc)',
            }}
          />
          <div
            style={{
              height: 160,
              background: 'linear-gradient(90deg,#E91E6333,#E91E63cc)',
            }}
          />
        </div>
      </Scrollbar>
    </div>
  )
}
