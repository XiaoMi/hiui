import React from 'react'
import { Tabs, TabPane } from '../src'

export const Vertical = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="tabs-basic__wrap">
        <Tabs direction="vertical">
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
