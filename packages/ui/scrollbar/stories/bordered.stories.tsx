import React from 'react'
import Scrollbar from '../src'

/**
 * @title 带边框
 */
export const Bordered = () => {
  return (
    <>
      <h1>带边框</h1>
      <div className="scrollbar-bordered__wrap" style={{ height: 320 }}>
        <Scrollbar bordered keepVisible>
          <div style={{ height: 640, width: '200%' }}>
            <div
              style={{ height: 160, background: 'linear-gradient(90deg,#03A9F433,#03A9F4cc)' }}
            />
            <div
              style={{ height: 160, background: 'linear-gradient(90deg,#00968833,#009688cc)' }}
            />
            <div
              style={{ height: 160, background: 'linear-gradient(90deg,#FF572233,#FF5722cc)' }}
            />
            <div
              style={{ height: 160, background: 'linear-gradient(90deg,#E91E6333,#E91E63cc)' }}
            />
          </div>
        </Scrollbar>
      </div>
    </>
  )
}
