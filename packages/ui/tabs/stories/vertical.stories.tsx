import React from 'react'
import { Tabs, TabPane } from '../src'

/**
 * @title 垂直布局
 */
export const Vertical = () => {
  return (
    <>
      <h1>Vertical</h1>
      <div className="tabs-vertical__wrap" style={{ marginBottom: 30 }}>
        <Tabs placement="vertical">
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
      <div className="tabs-basic__wrap" style={{ marginBottom: 30 }}>
        <Tabs placement="vertical" draggable>
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

      <div className="tabs-basic__wrap" style={{ marginBottom: 30 }}>
        <Tabs placement="vertical" editable>
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
      <div className="tabs-basic__wrap" style={{ marginBottom: 30 }}>
        <Tabs placement="vertical" style={{ height: 400 }}>
          {Array(48)
            .fill(undefined)
            .map((_, index) => {
              return (
                <TabPane key={index} tabId={index} tabTitle={`Tab ${index}`}>
                  {`Content of Tab Panel ${index}`}
                </TabPane>
              )
            })}
        </Tabs>
      </div>
    </>
  )
}
