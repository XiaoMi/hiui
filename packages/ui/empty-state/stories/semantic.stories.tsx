// AIGC START
import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import EmptyState from '../src'
import type { EmptyStateSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<EmptyStateSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="empty-state-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <EmptyState
              title="暂无数据"
              classNames={{
                root: 'my-empty-state__root',
                image: 'my-empty-state__image',
                title: 'my-empty-state__title',
                slot: 'my-empty-state__slot',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
              }}
            >
              <div>这里是自定义内容区域</div>
            </EmptyState>
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                {
                  title: 'root',
                  description: '根元素',
                },
                {
                  title: 'image',
                  description: '图片/指示器元素',
                },
                {
                  title: 'title',
                  description: '标题元素',
                },
                {
                  title: 'slot',
                  description: '子内容插槽',
                },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() => {
                      setSelected(dataItem.title as EmptyStateSemanticName)
                    }}
                    onMouseLeave={() => {
                      setSelected(undefined)
                    }}
                  >
                    <List.Item {...dataItem} />
                  </div>
                )
              }}
            />
          </Col>
        </Row>
      </div>
    </>
  )
}
// AIGC END
