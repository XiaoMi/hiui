import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Modal from '../src'
import type { ModalSemanticName } from '../src/Modal'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<ModalSemanticName>()
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  return (
    <>
      <h1>Semantic</h1>
      <div className="modal-semantic__wrap">
        <Row gutter={12}>
          <Col span={18} style={{ position: 'relative', zIndex: 0 }} ref={setContainer}>
            <Modal
              visible
              title="语义化功能示例"
              type="success"
              style={{ position: 'absolute', overflow: 'unset' }}
              container={container}
              classNames={{
                root: 'my-modal__root',
                overlay: 'my-modal__overlay',
                wrapper: 'my-modal__wrapper',
                header: 'my-modal__header',
                title: 'my-modal__title',
                icon: 'my-modal__icon',
                closeButton: 'my-modal__close-button',
                body: 'my-modal__body',
                footer: 'my-modal__footer',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                  overflow: 'unset',
                },
              }}
            >
              <div>这是 Modal 的内容区域</div>
              <div>通过 classNames 和 styles 属性可以自定义各个元素的样式</div>
            </Modal>
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
                  title: 'overlay',
                  description: '遮罩层',
                },
                {
                  title: 'wrapper',
                  description: '内容包装器',
                },
                {
                  title: 'header',
                  description: '头部区域',
                },
                {
                  title: 'title',
                  description: '标题',
                },
                {
                  title: 'icon',
                  description: '图标',
                },
                {
                  title: 'closeButton',
                  description: '关闭按钮',
                },
                {
                  title: 'body',
                  description: '内容区域',
                },
                {
                  title: 'footer',
                  description: '底部区域',
                },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() => {
                      setSelected(dataItem.title as any)
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
