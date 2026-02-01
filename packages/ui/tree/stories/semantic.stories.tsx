import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Tree from '../src'
import type { TreeSemanticName } from '../src'

const treeData = [
  {
    id: '1',
    title: '节点一',
    children: [
      { id: '1-1', title: '子节点 1-1' },
      { id: '1-2', title: '子节点 1-2' },
    ],
  },
  { id: '2', title: '节点二' },
]

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<TreeSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="tree-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Tree
              data={treeData}
              defaultExpandAll
              height={200}
              classNames={{
                root: 'my-tree__root',
                item: 'my-tree__item',
                itemContent: 'my-tree__item-content',
                itemIcon: 'my-tree__item-icon',
                itemTitle: 'my-tree__item-title',
              }}
              styles={{ [selected as string]: { outline: '1px solid #ffbe0a' } }}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素 (ul)' },
                { title: 'item', description: '树节点项 (li)' },
                { title: 'itemContent', description: '节点内容包裹层' },
                { title: 'itemIcon', description: '展开/收起图标' },
                { title: 'itemTitle', description: '节点标题' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as TreeSemanticName)}
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
