import React, { useMemo } from 'react'
import Scrollbar from '../src'

/**
 * @title 滚动事件
 * @desc 可以使用内置提供的一系列自定义滚动事件
 */
export const Event = () => {
  const scrollContent = useMemo(() => {
    return (
      <div style={{ height: 640, width: '200%' }}>
        <div style={{ height: 160, background: 'linear-gradient(90deg,#03A9F433,#03A9F4cc)' }} />
        <div style={{ height: 160, background: 'linear-gradient(90deg,#00968833,#009688cc)' }} />
        <div style={{ height: 160, background: 'linear-gradient(90deg,#FF572233,#FF5722cc)' }} />
        <div style={{ height: 160, background: 'linear-gradient(90deg,#E91E6333,#E91E63cc)' }} />
      </div>
    )
  }, [])

  return (
    <>
      <h1>滚动事件</h1>
      <h2>x、y滚动事件</h2>
      <div className="scrollbar-basic__wrap" style={{ height: 320, marginBottom: 64 }}>
        <Scrollbar
          onScrollX={(e) => console.log('scroll x')}
          onScrollY={() => console.log('scroll y')}
        >
          {scrollContent}
        </Scrollbar>
      </div>
      <h2>特定滚动方向事件</h2>
      <div className="scrollbar-basic__wrap" style={{ height: 320, marginBottom: 64 }}>
        <Scrollbar
          onScrollUp={() => console.log('scroll up')}
          onScrollDown={() => console.log('scroll down')}
          onScrollLeft={() => console.log('scroll left')}
          onScrollRight={() => console.log('scroll right')}
        >
          {scrollContent}
        </Scrollbar>
      </div>
      <h2>滚动到边界事件</h2>
      <div className="scrollbar-basic__wrap" style={{ height: 320, marginBottom: 64 }}>
        <Scrollbar
          onXReachStart={() => console.log('reach x start')}
          onXReachEnd={() => console.log('reach x end')}
          onYReachStart={() => console.log('reach y start')}
          onYReachEnd={() => console.log('reach y end')}
        >
          {scrollContent}
        </Scrollbar>
      </div>
    </>
  )
}
