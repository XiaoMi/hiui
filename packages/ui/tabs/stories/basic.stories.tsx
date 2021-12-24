import React from 'react'
import { Tabs, TabPane } from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="tabs-basic__wrap" style={{ background: '#ccc', padding: 20 }}>
        <Tabs>
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
