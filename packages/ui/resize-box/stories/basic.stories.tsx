import React from 'react'
import ResizeBox, { ResizeBoxPane } from '../src'

/**
 * @title 基础用法
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="resize-box-basic__wrap">
        <ResizeBox style={{ width: 600, height: 400, border: '1px solid #ddd' }}>
          <ResizeBoxPane defaultWidth={300} onResize={console.log}>
            <div style={{ width: '100%', padding: '5px', overflow: 'auto' }}>left content</div>
          </ResizeBoxPane>
          <ResizeBoxPane>
            <div style={{ width: '100%', padding: '5px' }}>right content</div>
          </ResizeBoxPane>
        </ResizeBox>
      </div>
    </>
  )
}
