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
            <div
              style={{
                width: '100%',
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              left content
            </div>
          </ResizeBoxPane>
          <ResizeBoxPane>
            <div
              style={{
                width: '100%',
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              right content
            </div>
          </ResizeBoxPane>
        </ResizeBox>
      </div>
    </>
  )
}
