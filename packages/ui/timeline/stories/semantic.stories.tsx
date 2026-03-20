import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Timeline, { TimelineSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<TimelineSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="timeline-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Timeline
              data={[
                { title: '步骤一', content: '描述信息一', timestamp: '2026-02-01' },
                { title: '步骤二', content: '描述信息二', timestamp: '2026-02-02' },
                { title: '步骤三', content: '描述信息三', timestamp: '2026-02-03' },
              ]}
              classNames={{
                root: 'my-timeline__root',
                item: 'my-timeline__item',
                itemTime: 'my-timeline__item-time',
                itemLine: 'my-timeline__item-line',
                itemDot: 'my-timeline__item-dot',
                itemTitle: 'my-timeline__item-title',
                itemContent: 'my-timeline__item-content',
              }}
              styles={{ [selected as string]: { outline: '1px solid #ffbe0a' } }}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素' },
                { title: 'item', description: '单个时间节点' },
                { title: 'itemTime', description: '时间文案' },
                { title: 'itemLine', description: '连接线' },
                { title: 'itemDot', description: '圆点/图标' },
                { title: 'itemTitle', description: '标题' },
                { title: 'itemContent', description: '描述内容' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as TimelineSemanticName)}
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
