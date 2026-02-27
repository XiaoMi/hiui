import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Transfer from '../src'
import type { TransferSemanticName } from '../src'

const data = [
  { id: '1', title: '选项一' },
  { id: '2', title: '选项二' },
  { id: '3', title: '选项三' },
  { id: '4', title: '选项四' },
]

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<TransferSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="transfer-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Transfer
              data={data}
              defaultTargetIds={['2']}
              title={['源', '目标']}
              classNames={{
                root: 'my-transfer__root',
                sourcePanel: 'my-transfer__source',
                operations: 'my-transfer__operations',
                targetPanel: 'my-transfer__target',
              }}
              styles={{
                [selected as string]: { outline: '1px solid #ffbe0a' },
              }}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素' },
                { title: 'sourcePanel', description: '源面板' },
                { title: 'operations', description: '操作区' },
                { title: 'targetPanel', description: '目标面板' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as TransferSemanticName)}
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
