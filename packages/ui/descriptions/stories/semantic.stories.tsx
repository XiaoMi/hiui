import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Descriptions from '../src'
import type { DescriptionsSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<DescriptionsSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="descriptions-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Descriptions
              classNames={{
                root: 'my-descriptions__root',
                table: 'my-descriptions__table',
                tbody: 'my-descriptions__tbody',
                cell: 'my-descriptions__cell',
                label: 'my-descriptions__label',
                content: 'my-descriptions__content',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
              }}
            >
              <Descriptions.Item label="名字">张三</Descriptions.Item>
              <Descriptions.Item label="Phone">15311969622</Descriptions.Item>
              <Descriptions.Item label="Address">北京天安门</Descriptions.Item>
              <Descriptions.Item label="Money1">100000000</Descriptions.Item>
              <Descriptions.Item label="Money2">100000022220</Descriptions.Item>
              <Descriptions.Item label="Money3">
                <div>test</div>
              </Descriptions.Item>
            </Descriptions>
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
                  title: 'table',
                  description: '表格元素',
                },
                {
                  title: 'tbody',
                  description: '表格体元素',
                },
                {
                  title: 'cell',
                  description: '单元格元素',
                },
                {
                  title: 'label',
                  description: '标签元素',
                },
                {
                  title: 'content',
                  description: '内容元素',
                },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() => {
                      setSelected(dataItem.title as DescriptionsSemanticName)
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
