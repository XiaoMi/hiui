import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Alert from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<
    'root' | 'icon' | 'message' | 'title' | 'content' | 'close'
  >()

  return (
    <>
      <h1>Semantic</h1>
      <div className="alert-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Alert
              classNames={{
                root: 'my-alert__root',
                icon: 'my-alert__icon',
                message: 'my-alert__message',
                title: 'my-alert__title',
                content: 'my-alert__content',
                close: 'my-alert__close',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
              }}
              title="信息提示的文案"
              content={<div>文字说明文字说明文字说明</div>}
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
                  title: 'message',
                  description: '消息区域',
                },
                {
                  title: 'title',
                  description: '标题元素',
                },
                {
                  title: 'content',
                  description: '内容元素',
                },
                {
                  title: 'close',
                  description: '关闭按钮',
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
