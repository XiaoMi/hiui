import React from 'react'
import Collapse from '../src'
import { TabList } from '@hi-ui/tabs'

/**
 * @title 设置标题内容
 */
export const Title = () => {
  const [xiaomiTabList] = React.useState([
    { tabId: '0', tabTitle: '小米10' },
    { tabId: '1', tabTitle: '小米11' },
    { tabId: '2', tabTitle: '小米12' },
  ])

  const [hongmiTabList] = React.useState([
    { tabId: '0', tabTitle: '红米2' },
    { tabId: '1', tabTitle: '红米note' },
    { tabId: '2', tabTitle: '红米note2' },
  ])

  const [xiaomiActiveId, setXiaomiActiveId] = React.useState<React.ReactText>('0')
  const [hongmiActiveId, setHongmiActiveId] = React.useState<React.ReactText>('0')

  return (
    <>
      <h1>Title</h1>
      <div className="collapse-title__wrap">
        <Collapse defaultActiveId={['1']}>
          <Collapse.Panel
            title={
              <TabList
                style={{ margin: '-14px 0 -14px -20px' }}
                data={xiaomiTabList}
                onClick={(evt) => {
                  evt.stopPropagation()
                }}
                activeId={xiaomiActiveId}
                onChange={setXiaomiActiveId}
              />
            }
            id="1"
          >
            <div
              style={{
                backgroundColor: '#f5f7fa',
                textAlign: 'center',
                padding: 32,
                color: '#1f2733',
              }}
            >
              我是{xiaomiTabList.find((item) => item.tabId === xiaomiActiveId)?.tabTitle}
            </div>
          </Collapse.Panel>
          <Collapse.Panel
            title={
              <TabList
                style={{ margin: '-14px 0 -14px -20px' }}
                data={hongmiTabList}
                onClick={(evt) => {
                  evt.stopPropagation()
                }}
                activeId={hongmiActiveId}
                onChange={setHongmiActiveId}
              />
            }
            id="12"
          >
            <div
              style={{
                backgroundColor: '#f5f7fa',
                textAlign: 'center',
                padding: 32,
                color: '#1f2733',
              }}
            >
              我是{hongmiTabList.find((item) => item.tabId === hongmiActiveId)?.tabTitle}
            </div>
          </Collapse.Panel>
        </Collapse>
      </div>
    </>
  )
}
