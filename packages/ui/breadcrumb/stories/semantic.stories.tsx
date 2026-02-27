import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import { HomeOutlined } from '@hi-ui/icons'
import Breadcrumb from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<'root' | 'item' | 'content' | 'icon' | 'separator'>()

  const [data] = React.useState([
    {
      icon: <HomeOutlined />,
      title: '首页',
      href: '/home',
    },
    {
      icon: <HomeOutlined />,
      title: '列表',
      href: '/list',
    },
    {
      icon: <HomeOutlined />,
      title: '手机详情',
      href: '/phone',
    },
  ])

  return (
    <>
      <h1>自定义样式</h1>
      <div className="breadcrumb-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Breadcrumb
              classNames={{
                root: 'my-breadcrumb__root',
                item: 'my-breadcrumb__item',
                content: 'my-breadcrumb__content',
                icon: 'my-breadcrumb__icon',
                separator: 'my-breadcrumb__separator',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
              }}
              data={data}
            />
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
                  title: 'item',
                  description: '项目元素',
                },
                {
                  title: 'content',
                  description: '内容元素',
                },
                {
                  title: 'icon',
                  description: '图标元素',
                },
                {
                  title: 'separator',
                  description: '分隔符元素',
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
