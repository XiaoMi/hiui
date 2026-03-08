import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '../src'
import type { ListSemanticName } from '../src/List'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<ListSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="list-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <List
              header="列表标题"
              data={[
                {
                  title: '列表项 1',
                  description: '这是列表项 1 的描述信息',
                },
                {
                  title: '列表项 2',
                  description: '这是列表项 2 的描述信息',
                },
                {
                  title: '列表项 3',
                  description: '这是列表项 3 的描述信息',
                },
              ]}
              render={(dataItem) => {
                return <List.Item {...dataItem} />
              }}
              classNames={{
                root: 'my-list__root',
                header: 'my-list__header',
                wrapper: 'my-list__wrapper',
                item: 'my-list__item',
                pagination: 'my-list__pagination',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
              }}
              pagination={{
                total: 200,
                pageSize: 10,
                placement: 'right',
              }}
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
                  title: 'header',
                  description: '列表头部',
                },
                {
                  title: 'wrapper',
                  description: '列表容器',
                },
                {
                  title: 'item',
                  description: '列表项',
                },
                {
                  title: 'pagination',
                  description: '分页容器',
                },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() => {
                      setSelected(dataItem.title as ListSemanticName)
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
