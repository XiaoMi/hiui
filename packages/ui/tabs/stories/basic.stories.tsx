import React from 'react'
import { Tabs, TabPane } from '../src'
import Button from '@hi-ui/button'

/**
 * @title 基础用法
 * @desc 基础标签页
 */
export const Basic = () => {
  const [activeTab, setActiveTab] = React.useState<React.ReactText>('1')

  return (
    <>
      <h1>Basic</h1>
      <div className="tabs-basic__wrap">
        <Button onClick={() => setActiveTab('2')}>更新面板</Button>
        <Tabs style={{ marginTop: 16 }} activeId={activeTab} onChange={setActiveTab}>
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
      </div>
    </>
  )
}
