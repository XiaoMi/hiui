import React from 'react'
import { Tabs, TabPane } from '../src'

export const Editable = () => {
  return (
    <>
      <h1>Editable</h1>
      <div className="tabs-editable__wrap">
        <Tabs
          editable
          onAdd={() => {
            console.log('ADD')
          }}
          onDelete={(a, b) => {
            console.log('DEL', a, b)
          }}
        >
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
