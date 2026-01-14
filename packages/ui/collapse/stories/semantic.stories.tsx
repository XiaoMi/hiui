import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Collapse from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<
    'root' | 'head' | 'icon' | 'titleContainer' | 'title' | 'extra' | 'contentWrapper' | 'content'
  >()

  return (
    <>
      <h1>Semantic</h1>
      <div className="collapse-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Collapse defaultActiveId={['1']} arrowPlacement="left">
              <Collapse.Panel
                id="1"
                title="面板标题"
                extra={<span>额外内容</span>}
                style={{ overflow: 'unset' }}
                classNames={{
                  root: 'my-collapse-panel__root',
                  head: 'my-collapse-panel__head',
                  icon: 'my-collapse-panel__icon',
                  titleContainer: 'my-collapse-panel__title-container',
                  title: 'my-collapse-panel__title',
                  extra: 'my-collapse-panel__extra',
                  contentWrapper: 'my-collapse-panel__content-wrapper',
                  content: 'my-collapse-panel__content',
                }}
                styles={{
                  [selected as string]: {
                    outline: '1px solid #ffbe0a',
                  },
                  ...(selected === 'content'
                    ? {
                        contentWrapper: {
                          overflow: 'unset',
                        },
                      }
                    : {}),
                }}
              >
                <div>这是面板内容</div>
              </Collapse.Panel>
            </Collapse>
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
                  title: 'head',
                  description: '头部区域',
                },
                {
                  title: 'icon',
                  description: '图标元素',
                },
                {
                  title: 'titleContainer',
                  description: '标题容器',
                },
                {
                  title: 'title',
                  description: '标题元素',
                },
                {
                  title: 'extra',
                  description: '额外内容元素',
                },
                {
                  title: 'contentWrapper',
                  description: '内容包装器',
                },
                {
                  title: 'content',
                  description: '内容区域',
                },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() => {
                      setSelected(dataItem.title as any)
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
