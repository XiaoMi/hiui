import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import { Message } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<'root' | 'icon' | 'title'>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="message-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Message
              classNames={{
                root: 'my-message__root',
                icon: 'my-message__icon',
                title: 'my-message__title',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
              }}
              title="欢迎使用 HiUI 组件库"
              type="success"
              autoClose={false}
            />
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
                  title: 'icon',
                  description: '图标元素',
                },
                {
                  title: 'title',
                  description: '标题元素',
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
