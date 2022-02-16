import React from 'react'
import { Tabs, TabPane } from '../src'
import Button from '@hi-ui/button'

export const Basic = () => {
  const [activeTab, setActiveTab] = React.useState('1')

  return (
    <>
      <h1>Basic</h1>
      <Button onClick={() => setActiveTab('2')}>更新面板</Button>
      <div className="tabs-basic__wrap">
        <Tabs activeId={activeTab}>
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
