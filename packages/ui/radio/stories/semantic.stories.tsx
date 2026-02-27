import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Radio from '../src'
import type { RadioSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对 Radio 进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<RadioSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="radio-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Radio
              checked
              classNames={{
                root: 'my-radio__root',
                controller: 'my-radio__controller',
                label: 'my-radio__label',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
              }}
            >
              选项一
            </Radio>
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素 (label)' },
                { title: 'controller', description: '圆形控制器' },
                { title: 'label', description: '文案' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as RadioSemanticName)}
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
