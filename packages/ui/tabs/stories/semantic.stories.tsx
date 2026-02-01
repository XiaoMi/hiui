import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Tabs from '../src'
import type { TabsSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<TabsSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="tabs-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Tabs
              defaultActiveId="1"
              classNames={{
                root: 'my-tabs__root',
                list: 'my-tabs__list',
                content: 'my-tabs__content',
              }}
              styles={{
                [selected as string]: { outline: '1px solid #ffbe0a' },
              }}
            >
              <Tabs.Pane tabId="1" tabTitle="标签一">
                内容一
              </Tabs.Pane>
              <Tabs.Pane tabId="2" tabTitle="标签二">
                内容二
              </Tabs.Pane>
            </Tabs>
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素' },
                { title: 'list', description: '标签列表' },
                { title: 'content', description: '内容区' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as TabsSemanticName)}
                  onMouseLeave={() => setSelected(undefined)}
                >
                  <List.Item {...dataItem} />
                </div>
              )}
            />
          </Col>
        </Row>
      </div>
    </>
  )
}
