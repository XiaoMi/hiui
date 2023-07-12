import React from 'react'
import { Tabs, TabPane } from '../src'

/**
 * @title 不活跃时卸载
 * @desc 标签内容不活跃时默认会卸载，可以通过 `unmountOnInactive` 属性来控制是否卸载
 */
export const UnmountOnInactive = () => {
  const [activeTab, setActiveTab] = React.useState<React.ReactText>('1')

  return (
    <>
      <h1>UnmountOnInactive</h1>
      <div className="tabs-unmount-on-inactive__wrap">
        <Tabs style={{ marginTop: 16 }} activeId={activeTab} onChange={setActiveTab}>
          <TabPane tabId="1" tabTitle="Tab 1" unmountOnInactive={false}>
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
          <TabPane tabId="2" tabTitle="Tab 2" unmountOnInactive={false}>
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
