import React from 'react'
import ResizeBox, { ResizeBoxPane } from '../src'

/**
 * @title 设置是否可折叠
 */
export const Collapsible = () => {
  const [collapsed, setCollapsed] = React.useState<boolean>(false)

  return (
    <>
      <h1>Collapsible</h1>
      <div className="resize-box-collapsible__wrap">
        <ResizeBox style={{ width: 600, height: 400, border: '1px solid #ddd' }}>
          <ResizeBoxPane
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            defaultWidth={200}
            onResize={console.log}
          >
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
