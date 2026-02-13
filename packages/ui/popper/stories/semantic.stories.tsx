import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Button from '@hi-ui/button'
import Popper, { PopperSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [btnRef, setBtnRef] = useState<HTMLButtonElement | HTMLAnchorElement | null>(null)
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState<PopperSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="popper-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Button ref={setBtnRef} onClick={() => setVisible(true)}>
              Open Popper
            </Button>
            <Popper
              visible={visible}
              attachEl={btnRef}
              arrow
              onClose={() => setVisible(false)}
              classNames={{
                root: 'my-popper__root',
                container: 'my-popper__container',
                arrow: 'my-popper__arrow',
                content: 'my-popper__content',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
              }}
            >
              The content of the Popper.
            </Popper>
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素' },
                { title: 'container', description: '容器元素' },
                { title: 'arrow', description: '箭头元素' },
                { title: 'content', description: '内容区域' },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() => {
                      setSelected(dataItem.title as PopperSemanticName)
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
