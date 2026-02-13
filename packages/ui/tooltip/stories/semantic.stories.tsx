import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Button from '@hi-ui/button'
import Tooltip, { TooltipSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<TooltipSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="tooltip-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Tooltip
              visible
              placement="bottom"
              title="Tooltip 提示内容"
              classNames={{
                root: 'my-tooltip__root',
                popper: 'my-tooltip__popper',
                arrow: 'my-tooltip__arrow',
                content: 'my-tooltip__content',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
              }}
            >
              <Button>Tooltip</Button>
            </Tooltip>
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: 'Tooltip 根元素' },
                { title: 'popper', description: 'Popper 包裹层' },
                { title: 'arrow', description: '箭头' },
                { title: 'content', description: '内容区' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as TooltipSemanticName)}
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
