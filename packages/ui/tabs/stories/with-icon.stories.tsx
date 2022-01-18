import React from 'react'
import { Tabs, TabPane } from '../src'
import { MailSendOutlined, FireOutlined, StarOutlined } from '@hi-ui/icons'

export const WithIcon = () => {
  return (
    <>
      <h1>带图标</h1>
      <div className="tabs-basic__wrap">
        <Tabs>
          <TabPane
            tabId="1"
            tabTitle={
              <span>
                <MailSendOutlined style={{ marginRight: 4 }} />
                目标
              </span>
            }
          >
            Content of Tab Panel 1
          </TabPane>
          <TabPane
            tabId="2"
            tabTitle={
              <span>
                <FireOutlined style={{ marginRight: 4 }} />
                结果
              </span>
            }
            disabled
          >
            Content of Tab Panel 2
          </TabPane>
          <TabPane
            tabId="3"
            tabTitle={
              <span>
                <StarOutlined style={{ marginRight: 4 }} />
                复盘
              </span>
            }
          >
            Content of Tab Panel 3
          </TabPane>
        </Tabs>
      </div>
    </>
  )
}
