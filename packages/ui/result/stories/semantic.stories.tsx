import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Result, { ResultSemanticName } from '../src'
import Button from '@hi-ui/button'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<ResultSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="result-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Result
              type="success"
              title="操作成功"
              content="内容已提交，请耐心等待审核"
              children={[<Button key="back">返回</Button>]}
              classNames={{
                root: 'my-result__root',
                image: 'my-result__image',
                title: 'my-result__title',
                content: 'my-result__content',
                children: 'my-result__children',
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
                { title: 'image', description: '图标/图片容器' },
                { title: 'title', description: '标题' },
                { title: 'content', description: '内容' },
                { title: 'children', description: '底部区域' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as ResultSemanticName)}
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
