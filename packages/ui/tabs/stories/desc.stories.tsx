import React from 'react'
import { Tabs, TabPane } from '../src'

export const Desc = () => {
  return (
    <>
      <h1>带描述</h1>
      <div className="tabs-basic__wrap">
        <Tabs type="desc" direction="vertical" style={{ marginBottom: 40 }}>
          <TabPane tabId="1" tabTitle="Tab 1" tabDesc="关于标签的描">
            Content of Tab Panel 1
          </TabPane>
          <TabPane tabId="2" tabTitle="Tab 2" disabled tabDesc="关于标签的描">
            Content of Tab Panel 2
          </TabPane>
          <TabPane tabId="3" tabTitle="Tab 3" tabDesc="关于标签的描">
            Content of Tab Panel 3
          </TabPane>
        </Tabs>
        <Tabs type="desc" direction="horizontal">
          <TabPane tabId="1" tabTitle="Tab 1" tabDesc="关于标签的描">
            Content of Tab Panel 1
          </TabPane>
          <TabPane tabId="2" tabTitle="Tab 2" disabled tabDesc="关于标签的描">
            Content of Tab Panel 2
          </TabPane>
          <TabPane tabId="3" tabTitle="Tab 3" tabDesc="关于标签的描">
            Content of Tab Panel 3
          </TabPane>
        </Tabs>
      </div>
    </>
  )
}
