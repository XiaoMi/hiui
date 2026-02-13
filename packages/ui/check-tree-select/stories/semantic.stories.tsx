import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import CheckTreeSelect, { CheckTreeSelectSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对 CheckTreeSelect 各元素进行细粒度的样式控制（含 Picker 的 root/container/panel 等及 tree）
 */
export const Semantic = () => {
  const [data] = React.useState([
    {
      title: '手机类',
      id: '0',
      children: [
        {
          title: 'Redmi系列',
          id: '0-0',
          disabled: true,
          children: [
            {
              id: '0-0-1',
              title: 'Redmi K30',
            },
            {
              id: '0-0-2',
              title: 'Redmi K30 Pro',
            },
            {
              id: '0-0-3',
              title: 'Redmi 10X 5G',
            },
            {
              id: '0-0-4',
              title: 'Redmi Note 8',
            },
            {
              id: '0-0-5',
              title: 'Redmi 9',
            },
            {
              id: '0-0-6',
              title: 'Redmi 9A',
            },
          ],
        },
        {
          title: '小米手机',
          id: '0-1',
          children: [
            {
              id: '0-1-1',
              title: '小米10 Pro',
            },
            {
              id: '0-1-2',
              title: '小米10',
            },
            {
              id: '0-1-3',
              title: '小米10 青春版 5G',
            },
            {
              id: '0-1-4',
              title: '小米MIX Alpha',
            },
          ],
        },
      ],
    },
    {
      title: '电视',
      id: '1',
      children: [
        {
          title: '小米电视 大师 65英寸OLED',
          id: '1-0',
        },
        {
          title: 'Redmi 智能电视 MAX 98',
          id: '1-1',
        },
        {
          title: '小米电视4A 60英寸',
          id: '1-2',
        },
      ],
    },
  ])

  const [selected, setSelected] = useState<CheckTreeSelectSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="check-tree-select-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <CheckTreeSelect
              style={{ width: 240 }}
              searchable
              searchMode="filter"
              visible
              clearable
              data={data}
              classNames={{
                root: 'my-check-tree-select__root',
                container: 'my-check-tree-select__container',
                panel: 'my-check-tree-select__panel',
                header: 'my-check-tree-select__header',
                search: 'my-check-tree-select__search',
                body: 'my-check-tree-select__body',
                footer: 'my-check-tree-select__footer',
                tree: 'my-check-tree-select__tree',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
                panel: {
                  overflow: 'unset',
                  ...(selected === 'panel'
                    ? {
                        outline: '1px solid #ffbe0a',
                      }
                    : {}),
                },
              }}
              renderExtraHeader={() => <div style={{ padding: '10px 14px' }}>custom header</div>}
              renderExtraFooter={() => 'custom footer'}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素' },
                { title: 'container', description: '下拉容器' },
                { title: 'panel', description: '下拉面板' },
                { title: 'header', description: '头部' },
                { title: 'search', description: '搜索区' },
                { title: 'body', description: '内容区' },
                { title: 'footer', description: '底部' },
                { title: 'tree', description: '树容器' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as CheckTreeSelectSemanticName)}
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
