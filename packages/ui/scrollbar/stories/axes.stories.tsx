import React, { useMemo } from 'react'
import Scrollbar from '../src'

/**
 * @title 使能坐标轴
 * @desc 默认 `x`、`y` 都可滚动
 */
export const Axes = () => {
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
      <h1>使能坐标轴</h1>
      <h2>both(default)</h2>
      <div className="scrollbar-axes__wrap" style={{ height: 320, marginBottom: 64 }}>
        <Scrollbar>{scrollContent}</Scrollbar>
      </div>
      <h2>x</h2>
      <div className="scrollbar-axes__wrap" style={{ height: 320, marginBottom: 64 }}>
        <Scrollbar axes={'x'}>{scrollContent}</Scrollbar>
      </div>
      <h2>y</h2>
      <div className="scrollbar-axes__wrap" style={{ height: 320, marginBottom: 64 }}>
        <Scrollbar axes={'y'}>{scrollContent}</Scrollbar>
      </div>
      <h2>none</h2>
      <div className="scrollbar-axes__wrap" style={{ height: 320, marginBottom: 64 }}>
        <Scrollbar axes={'none'}>{scrollContent}</Scrollbar>
      </div>
    </>
  )
}
