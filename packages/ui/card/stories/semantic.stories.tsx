import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Card from '../src'
import Button from '@hi-ui/button'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<
    'root' | 'cover' | 'header' | 'head' | 'title' | 'extra' | 'subhead' | 'body'
  >()

  return (
    <>
      <h1>Semantic</h1>
      <div className="card-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <h2>普通用法</h2>
            <Card
              title="卡片标题"
              subtitle="卡片副标题"
              extra={<Button type="primary">操作</Button>}
              style={{ width: '80%', overflow: 'unset' }}
              classNames={{
                root: 'my-card__root',
                cover: 'my-card__cover',
                header: 'my-card__header',
                head: 'my-card__head',
                title: 'my-card__title',
                extra: 'my-card__extra',
                subhead: 'my-card__subhead',
                body: 'my-card__body',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
              }}
              coverUrl="http://i1.mifile.cn/f/i/hiui/docs/card/pic_9.png"
            >
              <div>卡片内容</div>
            </Card>
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
                  title: 'cover',
                  description: '封面元素',
                },
                {
                  title: 'header',
                  description: '头部区域',
                },
                {
                  title: 'head',
                  description: '头部标题和额外内容区域',
                },
                {
                  title: 'title',
                  description: '标题元素',
                },
                {
                  title: 'extra',
                  description: '额外内容元素',
                },
                {
                  title: 'subhead',
                  description: '副标题元素',
                },
                {
                  title: 'body',
                  description: '内容区域',
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
        <Card
          title="卡片标题"
          extra={<Button type="primary">操作</Button>}
          classNames={(info) => {
            if (info.props.hoverable) {
              return {
                root: 'my-card__root--hoverable',
                header: 'my-card__header--hoverable',
              }
            }
            return {}
          }}
          styles={(info) => {
            if (info.props.hoverable) {
              return {
                root: {
                  borderRadius: 4,
                },
              }
            }
            return {}
          }}
          hoverable
        >
          <div>卡片内容</div>
        </Card>
      </div>
    </>
  )
}
