import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import { CopyOutlined } from '@hi-ui/icons'
import TextArea, { TextAreaSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<TextAreaSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="textarea-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <TextArea
              placeholder="请输入"
              showCount
              maxLength={100}
              classNames={{
                root: 'my-textarea__root',
                inner: 'my-textarea__inner',
                header: 'my-textarea__header',
                text: 'my-textarea__text',
                count: 'my-textarea__count',
              }}
              styles={{
                [selected as string]: { outline: '1px solid #ffbe0a' },
              }}
              header={
                <>
                  <CopyOutlined style={{ marginRight: 6, fontSize: 16, color: '#5f6a7a' }} />
                </>
              }
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根/包装器' },
                { title: 'inner', description: '内层容器' },
                { title: 'header', description: '头部' },
                { title: 'text', description: '输入框' },
                { title: 'count', description: '字数统计' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as TextAreaSemanticName)}
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
