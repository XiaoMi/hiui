import React from 'react'
import { Tabs, TabPane } from '../src'
import Button from '@hi-ui/button'

export const Extra = () => {
  return (
    <>
      <h1>Extra</h1>
      <div className="tabs-extra__wrap">
        <Tabs extra={<Button>申请</Button>}>
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
