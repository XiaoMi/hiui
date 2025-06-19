import React from 'react'
import Button from '@hi-ui/button'
import { Tabs, TabPane } from '../src'

/**
 * @title 拖拽排序
 * @desc Tabs 排序功能
 */
export const Draggable = () => {
  const [activeId, setActiveId] = React.useState<React.ReactText>('1')

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
      <h1>Draggable</h1>
      <div className="tabs-draggable__wrap">
        <Tabs
          draggable
          activeId={activeId}
          onChange={setActiveId}
          onDrop={(e, { dragNode, targetNode, direction }) => {
            console.log('DRAG DROP', e, dragNode, targetNode, direction)

            // 注意：dragNode 是接收拖拽的目标节点，targetNode 是被拖拽的节点
            const draggedNodeIndex = tabContents.findIndex(
              (item) => item.tabId === targetNode.tabId
            )
            const dropTargetIndex = tabContents.findIndex((item) => item.tabId === dragNode.tabId)

            if (draggedNodeIndex === dropTargetIndex) return

            const newTabContents = [...tabContents]
            // 从原位置移除被拖拽的节点
            const [draggedItem] = newTabContents.splice(draggedNodeIndex, 1)

            // 计算插入位置
            let insertIndex = dropTargetIndex
            // 如果被拖拽节点在目标节点前面，移除后目标索引需要减1
            if (draggedNodeIndex < dropTargetIndex) {
              insertIndex = dropTargetIndex - 1
            }

            // 根据方向调整插入位置
            if (direction === 'next') {
              insertIndex = insertIndex + 1
            }

            // 将被拖拽的节点插入到新位置
            newTabContents.splice(insertIndex, 0, draggedItem)

            setTabContents(newTabContents)
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
