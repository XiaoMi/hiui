import React from 'react'
import Message from '@hi-ui/message'
import Button from '@hi-ui/button'
import Dropdown from '@hi-ui/dropdown'
import { EllipsisVerticalOutlined } from '@hi-ui/icons'
import { Tabs, TabPane } from '../src'

/**
 * @title 可编辑
 * @desc 支持标签的增加、删除和修改
 */
export const EditRender = () => {
  const [tabContents, setTabContents] = React.useState<
    {
      tabId: string
      tabTitle: string
      content: React.ReactNode
    }[]
  >([
    {
      tabId: '1',
      tabTitle: 'Tab 1',
      content: <Button type="primary">Button</Button>,
    },
    {
      tabId: '2',
      tabTitle: 'Tab 2',
      content: <div>Content of Tab Panel 2</div>,
    },

    {
      tabId: '3',
      tabTitle: 'Tab 3',
      content: <div>Content of Tab Panel 3</div>,
    },
  ])

  return (
    <>
      <h1>EditRender</h1>
      <div className="tabs-edit-render__wrap">
        <Tabs
          editable
          showDivider
          maxTabTitleWidth={100}
          editRender={(item, index, actions) => {
            console.log('editRender', item, index, actions)
            return (
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
                <Dropdown
                  trigger="click"
                  data={[
                    {
                      id: 'copy',
                      title: '复制',
                    },
                    {
                      id: 'edit',
                      title: '重命名',
                    },
                    ...(tabContents.length > 1
                      ? [
                          {
                            id: 'divider',
                            title: '分割线',
                            split: true,
                          },
                          {
                            id: 'delete',
                            title: '删除',
                          },
                        ]
                      : []),
                  ]}
                  onClick={(id) => {
                    if (id === 'copy') {
                      actions.copy()
                      // or 指定插入位置
                      // actions.copy(index + 1)
                      return
                    }
                    if (id === 'edit') {
                      actions.edit()
                      return
                    }
                    if (id === 'delete') {
                      actions.delete()
                    }
                  }}
                >
                  <Button
                    type="primary"
                    size="xs"
                    appearance="link"
                    icon={<EllipsisVerticalOutlined />}
                  />
                </Dropdown>
              </div>
            )
          }}
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

            setTabContents([
              ...tabContents,
              {
                tabId: newTabId,
                tabTitle: newTabTitle,
                content: `Content of Tab Panel ${newTabTitle}`,
              },
            ])
          }}
          onDelete={(deletedNode, evt) => {
            console.log('DELETE', deletedNode)

            setTabContents(tabContents.filter((item) => item.tabId !== deletedNode.tabId))
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

            setTabContents(
              tabContents.map((item) => {
                if (item.tabId === updatedItem.tabId) {
                  return { ...item, tabTitle: value }
                }
                return item
              })
            )
          }}
          onCopy={(sourceItem, copiedItem, newItems) => {
            console.log('COPY', sourceItem, copiedItem, newItems)

            setTabContents([
              ...newItems.map((item) => ({
                tabId: item.tabId as string,
                tabTitle: item.tabTitle as string,
                content:
                  tabContents.find((tab) => tab.tabId === item.tabId)?.content ??
                  tabContents.find((tab) => tab.tabId === sourceItem.tabId)?.content,
              })),
            ])
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
