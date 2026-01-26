import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Button from '@hi-ui/button'
import { Notification } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<
    'root' | 'container' | 'header' | 'icon' | 'title' | 'content' | 'footer' | 'close'
  >()
  const [container, setContainer] = useState<HTMLElement | null>(null)

  return (
    <>
      <h1>Semantic</h1>
      <div className="notification-semantic__wrap">
        <Row gutter={12}>
          <Col span={18} ref={setContainer} style={{ position: 'relative', zIndex: 0 }}>
            <Notification
              container={container}
              direction="left"
              classNames={{
                root: 'my-notification__root',
                container: 'my-notification__container',
                header: 'my-notification__header',
                icon: 'my-notification__icon',
                title: 'my-notification__title',
                content: 'my-notification__content',
                footer: 'my-notification__footer',
                close: 'my-notification__close',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
              }}
              title="数据备份通知"
              content="各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！"
              autoClose={false}
              style={{ position: 'absolute', overflow: 'unset' }}
              action={
                <>
                  <Button type="default" appearance="line">
                    取消
                  </Button>
                  <Button type="primary">确认</Button>
                </>
              }
            />
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
                  title: 'container',
                  description: '容器元素',
                },
                {
                  title: 'header',
                  description: '头部区域',
                },
                {
                  title: 'icon',
                  description: '图标元素',
                },
                {
                  title: 'title',
                  description: '标题元素',
                },
                {
                  title: 'content',
                  description: '内容元素',
                },
                {
                  title: 'footer',
                  description: '底部操作区域',
                },
                {
                  title: 'close',
                  description: '关闭按钮',
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
