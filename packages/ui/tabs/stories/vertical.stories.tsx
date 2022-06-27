import React from 'react'
import { Tabs, TabPane } from '../src'

/**
 * @title 垂直布局
 */
export const Vertical = () => {
  return (
    <>
      <h1>Vertical</h1>
      <div className="tabs-vertical__wrap" style={{ marginBottom: 16 }}>
        <Tabs placement="vertical" style={{ height: 400 }}>
          {Array(48)
            .fill(undefined)
            .map((_, index) => {
              return (
                <TabPane key={index} tabId={index} tabTitle={`Tab ${index}`}>
                  <div
                    style={{
                      backgroundColor: '#f5f7fa',
                      textAlign: 'center',
                      padding: 32,
                      color: '#1f2733',
                    }}
                  >
                    {`Content of Tab Panel ${index}`}
                  </div>
                </TabPane>
              )
            })}
        </Tabs>
      </div>
    </>
  )
}
