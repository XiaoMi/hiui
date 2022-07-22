import React from 'react'
import { Tabs, TabPane } from '../src'
import { MailSendOutlined, FireOutlined, StarOutlined } from '@hi-ui/icons'

/**
 * @title 带图标
 */
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
          <TabPane
            tabId="3"
            tabTitle={
              <span>
                <StarOutlined style={{ marginRight: 4 }} />
                复盘
              </span>
            }
          >
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
