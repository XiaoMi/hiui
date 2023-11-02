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
        <Tabs type="button" defaultActiveId={'3'} placement="vertical">
          <TabPane tabId="1" tabTitle="Tab 1">
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
          <TabPane tabId="2" tabTitle="Tab 2">
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
          <TabPane tabId="3" tabTitle="Tab 3">
            <Tabs>
              <TabPane tabId="1" tabTitle="Sub Tab 1">
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
              <TabPane tabId="2" tabTitle="Sub Tab 2">
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
              <TabPane tabId="3" tabTitle="Sub Tab 3">
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
          </TabPane>
        </Tabs>
        <br />
        <br />
        <Tabs type="button" defaultActiveId={'3'}>
          <TabPane tabId="1" tabTitle="Tab 1">
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
          <TabPane tabId="2" tabTitle="Tab 2">
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
          <TabPane tabId="3" tabTitle="Tab 3">
            <Tabs placement="vertical">
              <TabPane tabId="1" tabTitle="Sub Tab 1">
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
              <TabPane tabId="2" tabTitle="Sub Tab 2">
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
              <TabPane tabId="3" tabTitle="Sub Tab 3">
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
          </TabPane>
        </Tabs>
      </div>
    </>
  )
}
