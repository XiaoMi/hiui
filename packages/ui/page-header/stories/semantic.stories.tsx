import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import PageHeader from '../src'
import type { PageHeaderSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<PageHeaderSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="page-header-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <PageHeader
              classNames={{
                root: 'my-page-header__root',
                breadcrumb: 'my-page-header__breadcrumb',
                content: 'my-page-header__content',
                titleContainer: 'my-page-header__title-container',
                backButton: 'my-page-header__back-button',
                title: 'my-page-header__title',
                subTitle: 'my-page-header__sub-title',
                extra: 'my-page-header__extra',
              }}
              styles={{
                ...(selected && {
                  [selected]: {
                    outline: '1px solid #ffbe0a',
                  },
                }),
              }}
              title="页面标题"
              subTitle="页面副标题"
              breadcrumb={{
                data: [
                  {
                    title: '首页',
                    href: '/',
                  },
                  {
                    title: '列表',
                    href: '/',
                  },
                  {
                    title: '手机详情',
                    href: '/',
                  },
                ],
              }}
              extra={<span>操作区</span>}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素' },
                { title: 'breadcrumb', description: '面包屑容器' },
                { title: 'content', description: '内容区域' },
                { title: 'titleContainer', description: '标题容器' },
                { title: 'backButton', description: '返回按钮' },
                { title: 'title', description: '标题' },
                { title: 'subTitle', description: '副标题' },
                { title: 'extra', description: '额外内容' },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() => {
                      setSelected(dataItem.title as PageHeaderSemanticName)
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
