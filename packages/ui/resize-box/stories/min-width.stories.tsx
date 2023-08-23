import React from 'react'
import ResizeBox, { ResizeBoxPane } from '../src'

/**
 * @title 设置 pane 最小宽度
 */
export const MinWidth = () => {
  return (
    <>
      <h1>MinWidth</h1>
      <div className="resize-box-min-width__wrap">
        <ResizeBox style={{ width: 600, height: 400, border: '1px solid #ddd' }}>
          <ResizeBoxPane defaultWidth={300} minWidth={100}>
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
