import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Loading from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<
    'root' | 'mask' | 'content-wrapper' | 'icon' | 'content' | 'wrapper'
  >()

  return (
    <>
      <h1>Semantic</h1>
      <div className="loading-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <div style={{ position: 'relative', width: 500, height: 300 }}>
              <Loading
                classNames={{
                  root: 'my-loading__root',
                  mask: 'my-loading__mask',
                  icon: 'my-loading__icon',
                  content: 'my-loading__content',
                  wrapper: 'my-loading__wrapper',
                }}
                styles={{
                  [selected as string]: {
                    outline: '1px solid #ffbe0a',
                  },
                }}
                content="Loading..."
              >
                <div
                  style={{
                    height: 300,
                    boxSizing: 'border-box',
                    background: '#f5f7fa',
                    padding: 20,
                    border: '20px solid #5f6a7a',
                  }}
                ></div>
              </Loading>
            </div>
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
                  title: 'mask',
                  description: '蒙层元素',
                },
                {
                  title: 'wrapper',
                  description: '包裹器元素',
                },
                {
                  title: 'icon',
                  description: '图标元素',
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
