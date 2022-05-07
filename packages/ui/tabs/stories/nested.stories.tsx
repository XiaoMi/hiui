import React from 'react'
import { Tabs, TabPane } from '../src'

/**
 * @title 嵌套 Tabs
 */
export const Nested = () => {
  return (
    <>
      <h1>Nested</h1>
      <div className="tabs-nested__wrap">
        <Tabs type="button" defaultActiveId={'1'} placement="vertical">
          <TabPane tabId="1" tabTitle="Tab 1">
            Content of Tab Panel 1
          </TabPane>
          <TabPane tabId="2" tabTitle="Tab 2" disabled>
            Content of Tab Panel 2
          </TabPane>
          <TabPane tabId="3" tabTitle="Tab 3">
            <Tabs>
              <TabPane tabId="1" tabTitle="Sub Tab 1">
                Content of Tab Panel 1
              </TabPane>
              <TabPane tabId="2" tabTitle="Sub Tab 2" disabled>
                Content of Tab Panel 2
              </TabPane>
              <TabPane tabId="3" tabTitle="Sub Tab 3">
                Content of Tab Panel 3
              </TabPane>
            </Tabs>
          </TabPane>
        </Tabs>
        <br />
        <br />
        <Tabs type="button" defaultActiveId={'1'}>
          <TabPane tabId="1" tabTitle="Tab 1">
            Content of Tab Panel 1
          </TabPane>
          <TabPane tabId="2" tabTitle="Tab 2" disabled>
            Content of Tab Panel 2
          </TabPane>
          <TabPane tabId="3" tabTitle="Tab 3">
            <Tabs placement="vertical">
              <TabPane tabId="1" tabTitle="Sub Tab 1">
                Content of Tab Panel 1
              </TabPane>
              <TabPane tabId="2" tabTitle="Sub Tab 2" disabled>
                Content of Tab Panel 2
              </TabPane>
              <TabPane tabId="3" tabTitle="Sub Tab 3">
                Content of Tab Panel 3
              </TabPane>
            </Tabs>
          </TabPane>
        </Tabs>
      </div>
    </>
  )
}
