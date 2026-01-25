import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Drawer from '../src'
import Button from '@hi-ui/button'
import type { DrawerSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<DrawerSemanticName>()
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  return (
    <>
      <h1>Semantic</h1>
      <div className="drawer-semantic__wrap">
        <Row gutter={12}>
          <Col span={18} ref={setContainer} style={{ position: 'relative', zIndex: 0 }}>
            <Drawer
              title="抽屉标题"
              visible
              placement="left"
              container={container}
              style={{
                position: 'absolute',
                overflow: 'unset',
                left: 1,
                top: 1,
                right: 1,
                bottom: 10,
              }}
              footer={
                <div style={{ textAlign: 'right' }}>
                  <Button type="default" appearance="line">
                    取消
                  </Button>
                  <Button type="primary">确认</Button>
                </div>
              }
              classNames={{
                root: 'my-drawer__root',
                overlay: 'my-drawer__overlay',
                wrapper: 'my-drawer__wrapper',
                header: 'my-drawer__header',
                title: 'my-drawer__title',
                close: 'my-drawer__close',
                body: 'my-drawer__body',
                footer: 'my-drawer__footer',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                  overflow: 'unset',
                },
              }}
            >
              <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
              <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
              <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
              <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
              <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
            </Drawer>
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
                  description: '蒙层元素',
                },
                {
                  title: 'wrapper',
                  description: '抽屉包装器',
                },
                {
                  title: 'header',
                  description: '头部元素',
                },
                {
                  title: 'title',
                  description: '标题元素',
                },
                {
                  title: 'close',
                  description: '关闭按钮',
                },
                {
                  title: 'body',
                  description: '主体内容',
                },
                {
                  title: 'footer',
                  description: '底部元素',
                },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() => {
                      setSelected(dataItem.title as DrawerSemanticName)
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
