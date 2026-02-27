import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Button from '@hi-ui/button'
import Popover, { PopoverSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 控制各元素样式，继承 Popper 的 root/container/arrow/content
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<PopoverSemanticName>()
  const title = <span>文字提示</span>
  const content = (
    <div>
      <div>此处展示 Popover 具体内容</div>
      <div>具体内容可以自行渲染</div>
    </div>
  )

  return (
    <>
      <h1>Semantic</h1>
      <div className="popover-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Popover
              title={title}
              content={content}
              visible
              placement="bottom"
              trigger="click"
              classNames={{
                root: 'my-popover__root',
                container: 'my-popover__container',
                arrow: 'my-popover__arrow',
                content: 'my-popover__content',
                wrapper: 'my-popover__wrapper',
                title: 'my-popover__title',
                body: 'my-popover__body',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
              }}
            >
              <Button>Trigger</Button>
            </Popover>
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: 'Popper 根' },
                { title: 'container', description: 'Popper 容器' },
                { title: 'arrow', description: 'Popper 箭头' },
                { title: 'content', description: 'Popper 内容区' },
                { title: 'wrapper', description: '气泡根' },
                { title: 'title', description: '标题' },
                { title: 'body', description: '正文' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as PopoverSemanticName)}
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
