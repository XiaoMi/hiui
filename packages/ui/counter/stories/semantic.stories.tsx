import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Counter from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<
    'root' | 'content' | 'minus' | 'inputWrapper' | 'input' | 'plus'
  >()

  return (
    <>
      <h1>Semantic</h1>
      <div className="counter-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Counter
              defaultValue={0}
              classNames={{
                root: 'my-counter__root',
                content: 'my-counter__content',
                minus: 'my-counter__minus',
                inputWrapper: 'my-counter__input-wrapper',
                input: 'my-counter__input',
                plus: 'my-counter__plus',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
              }}
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
                  title: 'content',
                  description: '内容容器',
                },
                {
                  title: 'minus',
                  description: '减号按钮',
                },
                {
                  title: 'inputWrapper',
                  description: '输入框包装器',
                },
                {
                  title: 'input',
                  description: '输入框',
                },
                {
                  title: 'plus',
                  description: '加号按钮',
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
