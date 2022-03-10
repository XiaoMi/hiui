import React from 'react'
import { Tabs, TabPane } from '../src'

export const Type = () => {
  return (
    <>
      <h1>Type</h1>
      <div className="tabs-type__wrap" style={{ padding: 20, background: '#ebedf0' }}>
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
