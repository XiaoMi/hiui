import React from 'react'
import { Tabs, TabPane } from '../src'

export const Type = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="tabs-basic__wrap">
        <Tabs type="card" direction="vertical" style={{ marginBottom: 40 }}>
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
        <Tabs type="card" direction="horizontal">
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
