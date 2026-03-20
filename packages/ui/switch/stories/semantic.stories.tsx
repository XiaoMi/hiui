import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Switch, { SwitchSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<SwitchSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="switch-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Switch
              defaultChecked
              content={['关', '开']}
              classNames={{
                root: 'my-switch__root',
                text: 'my-switch__text',
                handle: 'my-switch__handle',
              }}
              styles={{
                [selected as string]: { outline: '1px solid #ffbe0a' },
              }}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素' },
                { title: 'text', description: '文案' },
                { title: 'handle', description: '滑块' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as SwitchSemanticName)}
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
