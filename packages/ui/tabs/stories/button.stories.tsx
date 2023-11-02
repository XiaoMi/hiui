import React from 'react'
import { Tabs, TabPane } from '../src'

/**
 * @title 胶囊样式
 * @desc 可用于页面的按钮式布局样式
 */
export const Button = () => {
  return (
    <>
      <h1>胶囊式</h1>
      <div className="tabs-basic__wrap">
        <Tabs type="button" placement="vertical" style={{ marginBottom: 40 }} draggable>
          <TabPane tabId="1" tabTitle={<div style={{ padding: '0 10px' }}>Tab1</div>}>
            <div
              style={{
                backgroundColor: '#f5f7fa',
                textAlign: 'center',
                padding: 32,
                color: '#1f2733',
              }}
            >
              Content of Tab Panel 1
            </div>
          </TabPane>
          <TabPane tabId="2" tabTitle={<div style={{ padding: '0 10px' }}>Tab2</div>}>
            <div
              style={{
                backgroundColor: '#f5f7fa',
                textAlign: 'center',
                padding: 32,
                color: '#1f2733',
              }}
            >
              Content of Tab Panel 2
            </div>
          </TabPane>
          <TabPane tabId="3" tabTitle={<div style={{ padding: '0 10px' }}>Tab3</div>}>
            <div
              style={{
                backgroundColor: '#f5f7fa',
                textAlign: 'center',
                padding: 32,
                color: '#1f2733',
              }}
            >
              Content of Tab Panel 3
            </div>
          </TabPane>
        </Tabs>
        <Tabs type="button" placement="horizontal" draggable>
          <TabPane tabId="1" tabTitle={<div style={{ padding: '0 10px' }}>Tab1</div>}>
            <div
              style={{
                backgroundColor: '#f5f7fa',
                textAlign: 'center',
                padding: 32,
                color: '#1f2733',
              }}
            >
              Content of Tab Panel 1
            </div>
          </TabPane>
          <TabPane tabId="2" tabTitle={<div style={{ padding: '0 10px' }}>Tab2</div>}>
            <div
              style={{
                backgroundColor: '#f5f7fa',
                textAlign: 'center',
                padding: 32,
                color: '#1f2733',
              }}
            >
              Content of Tab Panel 2
            </div>
          </TabPane>
          <TabPane tabId="3" tabTitle={<div style={{ padding: '0 10px' }}>Tab3</div>}>
            <div
              style={{
                backgroundColor: '#f5f7fa',
                textAlign: 'center',
                padding: 32,
                color: '#1f2733',
              }}
            >
              Content of Tab Panel 3
            </div>
          </TabPane>
          <TabPane tabId="4" tabTitle={<div style={{ padding: '0 10px' }}>Tab4</div>}>
            <div
              style={{
                backgroundColor: '#f5f7fa',
                textAlign: 'center',
                padding: 32,
                color: '#1f2733',
              }}
            >
              Content of Tab Panel 4
            </div>
          </TabPane>
          <TabPane tabId="5" tabTitle={<div style={{ padding: '0 10px' }}>Tab5</div>}>
            <div
              style={{
                backgroundColor: '#f5f7fa',
                textAlign: 'center',
                padding: 32,
                color: '#1f2733',
              }}
            >
              Content of Tab Panel 5
            </div>
          </TabPane>
        </Tabs>
      </div>
    </>
  )
}
