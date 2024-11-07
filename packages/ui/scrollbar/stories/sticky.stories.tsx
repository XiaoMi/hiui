import React, { useRef, useEffect } from 'react'
import Scrollbar, { ScrollbarHelpers } from '../src'

/**
 * @title 滚动条吸底
 * @desc 默认不开启，开启后默认在 Scrollbar 组件内部滚动有效，如需外部使用，需要手动调用 update 方法
 */
export const Fixed = () => {
  const innerRef = useRef<ScrollbarHelpers>(null)
  const update = () => innerRef.current?.update?.()

  // 此处演示在外部使用该效果
  useEffect(() => {
    document.addEventListener('scroll', update)

    return () => {
      document.removeEventListener('scroll', update)
    }
  }, [])

  return (
    <>
      <h1>滚动条吸底</h1>
      <div className="scrollbar-sticky__wrap">
        <Scrollbar
          innerRef={innerRef}
          keepVisible
          style={{
            height: 400,
          }}
          settings={{ scrollbarXStickToBottom: true, scrollbarXStickToBottomGap: 20 }}
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
    </>
  )
}
