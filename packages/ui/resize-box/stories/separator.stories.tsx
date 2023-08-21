import React from 'react'
import ResizeBox, { ResizeBoxPane } from '../src'

/**
 * @title 自定义分割器
 */
export const Separator = () => {
  const customSeparator = (
    <div
      style={{
        width: '2px',
        height: '100%',
        background: '#ddd',
        cursor: 'col-resize',
      }}
    ></div>
  )

  return (
    <>
      <h1>Separator</h1>
      <div className="resize-box-separator__wrap">
        <ResizeBox
          separator={customSeparator}
          style={{ width: 600, height: 400, border: '1px solid #ddd' }}
        >
          <ResizeBoxPane>
            <div style={{ width: '100%', padding: '.5em', overflow: 'auto' }}>left content</div>
          </ResizeBoxPane>
          <ResizeBoxPane>
            <div style={{ width: '100%', padding: '.5em' }}>right content</div>
          </ResizeBoxPane>
        </ResizeBox>
      </div>
    </>
  )
}
