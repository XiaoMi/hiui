import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Progress, { ProgressSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<ProgressSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="progress-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Progress
              percent={60}
              bufferPercent={80}
              classNames={{
                root: 'my-progress__root',
                inner: 'my-progress__inner',
                buffer: 'my-progress__buffer',
                value: 'my-progress__value',
                content: 'my-progress__content',
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
                { title: 'inner', description: '进度条轨道容器' },
                { title: 'buffer', description: '缓冲区条' },
                { title: 'value', description: '进度条填充' },
                { title: 'content', description: '进度文案' },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() => {
                      setSelected(dataItem.title as ProgressSemanticName)
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
