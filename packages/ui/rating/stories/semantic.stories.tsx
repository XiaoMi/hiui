import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Rating, { RatingSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<RatingSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="rating-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Rating
              defaultValue={3}
              descRender={(v) => `当前 ${v} 分`}
              classNames={{
                root: 'my-rating__root',
                star: 'my-rating__star',
                desc: 'my-rating__desc',
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
                { title: 'root', description: '根元素 (ul)' },
                { title: 'star', description: '单个星星项' },
                { title: 'desc', description: '描述文案区域' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as RatingSemanticName)}
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
