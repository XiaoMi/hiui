import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Button from '../src'
import { PlusOutlined, MinusOutlined } from '@hi-ui/icons'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<'root' | 'prefixIcon' | 'suffixIcon'>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="button-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <h2>普通用法</h2>
            <Button
              type="primary"
              icon={[<PlusOutlined key="prefix" />, <MinusOutlined key="suffix" />]}
              classNames={{
                root: 'my-button__root',
                prefixIcon: 'my-button__prefix-icon',
                suffixIcon: 'my-button__suffix-icon',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
              }}
            >
              按钮
            </Button>
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
                  title: 'prefixIcon',
                  description: '前缀图标元素',
                },
                {
                  title: 'suffixIcon',
                  description: '后缀图标元素',
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

        <h2>函数用法</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          classNames={(info) => {
            if (info.props.type === 'primary') {
              return {
                root: 'my-button__root--primary',
                prefixIcon: 'my-button__prefix-icon--primary',
              }
            }
            return {}
          }}
          styles={(info) => {
            if (info.props.type === 'primary') {
              return {
                root: {
                  borderRadius: 8,
                },
                prefixIcon: {
                  fontSize: 18,
                },
              }
            }
            return {}
          }}
        >
          按钮
        </Button>
      </div>
    </>
  )
}
