import React from 'react'
import Provider from '../src'
import Button from '@hi-ui/button'
import Drawer from '@hi-ui/drawer'
import Modal from '@hi-ui/modal'
import Space from '@hi-ui/space'
import { createMessage } from '@hi-ui/message'
import { createNotification } from '@hi-ui/notification'

/**
 * @title 设置 portal
 * @desc 通过 Provider 设置 portal，可以将 Drawer、Modal 等组件的弹出层渲染在特定的 DOM 节点下
 */
export const Portal = () => {
  const [drawerVisible, setDrawerVisible] = React.useState(false)
  const [modalVisible, setModalVisible] = React.useState(false)
  const [container, setContainer] = React.useState<HTMLElement | null>(null)

  const message = React.useMemo(() => {
    if (!container) return createMessage()
    return createMessage({ container })
  }, [container])

  const notification = React.useMemo(() => {
    if (!container) return createNotification()
    return createNotification({ container })
  }, [container])

  return (
    <>
      <h1>设置 Portal</h1>
      <div className="provider-portal__wrap">
        <Provider portal={{ container }}>
          <Space style={{ marginBottom: 12 }}>
            <Button type="secondary" onClick={() => setDrawerVisible(!drawerVisible)}>
              Drawer
            </Button>
            <Button type="secondary" onClick={() => setModalVisible(!modalVisible)}>
              Modal
            </Button>
            <Button
              type="secondary"
              onClick={() => {
                message.open({
                  title: '欢迎使用 HiUI 组件库',
                  type: 'success',
                })
              }}
            >
              Message
            </Button>
            <Button
              type="secondary"
              onClick={() => {
                notification.open({
                  size: 'sm',
                  title: '数据备份通知',
                  content:
                    '各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护！',
                })
              }}
            >
              Notification
            </Button>
          </Space>
          {/* 必须设置一个拥有定位的父元素，组件显示在该元素内 */}
          <div
            ref={setContainer}
            className="drawer-container__wrap"
            style={{
              width: '100%',
              minWidth: 660,
              height: 420,
              background: '#f5f7fa',
              boxShadow: '1px 2px 8px #ddd',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',

              // Need add for it
              position: 'relative',
              overflow: 'hidden',
              zIndex: 0,
            }}
          >
            <Drawer
              title="抽屉标题"
              style={{ position: 'absolute' }}
              visible={drawerVisible}
              closeable={false}
              onClose={() => setDrawerVisible(false)}
            >
              我是一段文字，也可以是表单、表格、步骤条等等
            </Drawer>
            <Modal
              title="提示"
              style={{ position: 'absolute' }}
              visible={modalVisible}
              closeable={false}
              onCancel={() => setModalVisible(false)}
            >
              我是挂载指定容器的模态框内容
            </Modal>
          </div>
        </Provider>
      </div>
    </>
  )
}
