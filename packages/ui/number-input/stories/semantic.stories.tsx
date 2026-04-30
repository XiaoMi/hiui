import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import NumberInput, { NumberInputSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<NumberInputSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="number-input-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <NumberInput
              defaultValue={5}
              min={1}
              prefix="￥"
              suffix="元"
              placeholder="请输入数字"
              classNames={{
                root: 'my-number-input__root',
                prefix: 'my-number-input__prefix',
                input: 'my-number-input__input',
                suffix: 'my-number-input__suffix',
                handler: 'my-number-input__handler',
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
                { title: 'root', description: '根元素' },
                { title: 'prefix', description: '前缀' },
                { title: 'input', description: '输入框' },
                { title: 'suffix', description: '后缀' },
                { title: 'handler', description: '加减按钮区域' },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() => {
                      setSelected(dataItem.title as NumberInputSemanticName)
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
