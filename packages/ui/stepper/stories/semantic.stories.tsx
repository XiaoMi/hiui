import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Stepper, { StepperSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<StepperSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="stepper-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Stepper
              data={[
                { title: '步骤一', content: '描述' },
                { title: '步骤二', content: '描述' },
                { title: '步骤三', content: '描述' },
              ]}
              current={2}
              style={{ overflow: 'unset' }}
              classNames={{
                root: 'my-stepper__root',
                item: 'my-stepper__item',
                itemStatus: 'my-stepper__item-status',
                itemTip: 'my-stepper__item-tip',
                itemTipTitle: 'my-stepper__item-tip-title',
                itemTipContent: 'my-stepper__item-tip-content',
              }}
              styles={{ [selected as string]: { outline: '1px solid #ffbe0a' } }}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素' },
                { title: 'item', description: '单个步骤项' },
                { title: 'itemStatus', description: '步骤状态（图标/数字）' },
                { title: 'itemTip', description: '步骤文案容器' },
                { title: 'itemTipTitle', description: '步骤标题' },
                { title: 'itemTipContent', description: '步骤描述' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as StepperSemanticName)}
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
