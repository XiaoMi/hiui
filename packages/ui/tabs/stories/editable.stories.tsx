import React from 'react'
import Popover from '@hi-ui/popover'
import Message from '@hi-ui/message'
import Button from '@hi-ui/button'
import { Tabs, TabPane } from '../src'

/**
 * @title 可编辑
 * @desc 支持标签的增加、删除和修改
 */
export const Editable = () => {
  const [tabContents, setTabContents] = React.useState<
    {
      tabId: string
      tabTitle: string
      content: string
    }[]
  >([
    {
      tabId: '1',
      tabTitle: 'Tab 1',
      content: 'Content of Tab Panel 1',
    },
    {
      tabId: '2',
      tabTitle: 'Tab 2',
      content: 'Content of Tab Panel 2',
    },

    {
      tabId: '3',
      tabTitle: 'Tab 3',
      content: 'Content of Tab Panel 3',
    },
  ])

  return (
    <>
      <h1>Editable</h1>
      <div className="tabs-editable__wrap">
        <Tabs
          editable
          showDivider
          maxTabTitleWidth={100}
          onAdded={(newTab) => {
            console.log('ADDED', newTab)
            const { tabId, tabTitle } = newTab
            const newTabId = tabId as string
            const newTabTitle = tabTitle as string

            if (newTabTitle.length > 10) {
              Message.open({
                type: 'error',
                title: '标题长度不能超过 10 个字符',
              })
              return false
            }

            return new Promise<boolean>((resolve) => {
              setTabContents([
                ...tabContents,
                {
                  tabId: newTabId,
                  tabTitle: newTabTitle,
                  content: `Content of Tab Panel ${newTabTitle}`,
                },
              ])
              resolve(true)
            })
          }}
          onDelete={(deletedNode, evt) => {
            console.log('DELETE', deletedNode)
            return new Promise<boolean>((resolve) => {
              Popover.open(evt.currentTarget as HTMLElement, {
                key: 'delete-popover',
                content: (
                  <div>
                    <div>删除后，该标签下的项目也会删除</div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                      <Button
                        appearance="line"
                        size="sm"
                        onClick={() => Popover.close('delete-popover')}
                      >
                        取消
                      </Button>
                      <Button
                        type="danger"
                        size="sm"
                        onClick={() => {
                          Popover.close('delete-popover')
                          setTabContents(
                            tabContents.filter((item) => item.tabId !== deletedNode.tabId)
                          )
                          resolve(true)
                        }}
                      >
                        确定
                      </Button>
                    </div>
                  </div>
                ),
                onOutsideClick() {
                  Popover.close('delete-popover')
                },
              })
            })
          }}
          onEdit={(value, updatedItem) => {
            console.log('EDIT', value, updatedItem)
            if (value.length > 10) {
              Message.open({
                type: 'error',
                title: '标题长度不能超过 10 个字符',
              })
              return false
            }

            return new Promise<boolean>((resolve) => {
              setTabContents(
                tabContents.map((item) => {
                  if (item.tabId === updatedItem.tabId) {
                    return { ...item, tabTitle: value }
                  }
                  return item
                })
              )
              resolve(true)
            })
          }}
        >
          {tabContents.map((item) => (
            <TabPane key={item.tabId} tabId={item.tabId} tabTitle={item.tabTitle}>
              <div
                style={{
                  backgroundColor: '#f5f7fa',
                  textAlign: 'center',
                  padding: 32,
                  color: '#1f2733',
                }}
              >
                {item.content}
              </div>
            </TabPane>
          ))}
        </Tabs>
      </div>
    </>
  )
}
