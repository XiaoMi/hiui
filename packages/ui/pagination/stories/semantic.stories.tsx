import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import { Pagination } from '../src'
import type { PaginationSemanticName } from '../src/DefaultPagination'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<PaginationSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="pagination-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Pagination
              total={100}
              pageSize={10}
              showTotal
              showJumper
              pageSizeOptions={[10, 20, 50]}
              classNames={{
                root: 'my-pagination__root',
                total: 'my-pagination__total',
                list: 'my-pagination__list',
                prevButton: 'my-pagination__prev-button',
                nextButton: 'my-pagination__next-button',
                pager: 'my-pagination__pager',
                pageOption: 'my-pagination__page-option',
                jumper: 'my-pagination__jumper',
              }}
              styles={{
                ...(selected && {
                  [selected]: {
                    outline: '1px solid #ffbe0a',
                  },
                }),
              }}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素' },
                { title: 'total', description: '总数区域' },
                { title: 'list', description: '页码列表容器' },
                { title: 'prevButton', description: '上一页按钮' },
                { title: 'nextButton', description: '下一页按钮' },
                { title: 'pager', description: '页码项' },
                { title: 'pageOption', description: '每页条数选择' },
                { title: 'jumper', description: '跳转输入' },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() => {
                      setSelected(dataItem.title as PaginationSemanticName)
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
