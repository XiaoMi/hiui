import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Button from '@hi-ui/button'
import PopConfirm, { PopConfirmSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性控制各元素样式，继承 Popper 的 root/container/arrow/content
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<PopConfirmSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="pop-confirm-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <PopConfirm
              visible
              placement="bottom"
              title="确定要执行此操作吗？"
              content="此操作不可撤销"
              classNames={{
                root: 'my-pop-confirm__root',
                container: 'my-pop-confirm__container',
                arrow: 'my-pop-confirm__arrow',
                content: 'my-pop-confirm__content',
                wrapper: 'my-pop-confirm__wrapper',
                contentSection: 'my-pop-confirm__content-section',
                contentIcon: 'my-pop-confirm__content-icon',
                contentTitle: 'my-pop-confirm__content-title',
                body: 'my-pop-confirm__body',
                footer: 'my-pop-confirm__footer',
                btnCancel: 'my-pop-confirm__btn-cancel',
                btnConfirm: 'my-pop-confirm__btn-confirm',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
              }}
            >
              <Button>Trigger</Button>
            </PopConfirm>
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: 'Popper 根' },
                { title: 'container', description: 'Popper 容器' },
                { title: 'arrow', description: 'Popper 箭头' },
                { title: 'content', description: 'Popper 内容区' },
                { title: 'wrapper', description: '确认框根' },
                { title: 'contentSection', description: '标题区' },
                { title: 'contentIcon', description: '图标' },
                { title: 'contentTitle', description: '标题' },
                { title: 'body', description: '正文' },
                { title: 'footer', description: '底部' },
                { title: 'btnCancel', description: '取消按钮' },
                { title: 'btnConfirm', description: '确认按钮' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as PopConfirmSemanticName)}
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
