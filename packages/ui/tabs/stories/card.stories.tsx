import React from 'react'
import { Tabs, TabPane } from '../src'

/**
 * @title 卡片样式
 * @desc 常用于面板、卡片等局部空间
 */
export const Card = () => {
  return (
    <>
      <h1>Card</h1>
      <div className="tabs-card__wrap" style={{ padding: 20, background: '#ebedf0' }}>
        <Tabs type="card" placement="vertical" style={{ marginBottom: 40 }}>
          <TabPane tabId="1" tabTitle="Tab 1">
            Content of Tab Panel 1
          </TabPane>
          <TabPane tabId="2" tabTitle="Tab 2" disabled>
            Content of Tab Panel 2
          </TabPane>
          <TabPane tabId="3" tabTitle="Tab 3">
            Content of Tab Panel 3
          </TabPane>
        </Tabs>
        <Tabs type="card" placement="horizontal">
          <TabPane tabId="1" tabTitle="Tab 1">
            Content of Tab Panel 1
          </TabPane>
          <TabPane tabId="2" tabTitle="Tab 2" disabled>
            Content of Tab Panel 2
          </TabPane>
          <TabPane tabId="3" tabTitle="Tab 3">
            Content of Tab Panel 3
          </TabPane>
        </Tabs>
      </div>
    </>
  )
}
