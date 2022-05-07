import React from 'react'
import Button from '@hi-ui/button'
import Modal from '../src'

/**
 * @title 自定义按钮
 * @desc 通过 footer 自定义底部的按钮，并自定义事件
 */
export const Footer = () => {
  const [visible, setVisible] = React.useState(false)
  console.log('visible', visible)

  return (
    <>
      <h1>Footer</h1>
      <div className="modal-footer__wrap">
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <Modal
          visible={visible}
          closeable={false}
          onCancel={() => setVisible(false)}
          footer={[
            <Button type="primary" key={0} onClick={() => console.log(1)}>
              自定义按钮1
            </Button>,
            <Button type="success" key={1} onClick={() => console.log(2)}>
              自定义按钮2
            </Button>,
            <Button type="danger" key={2} onClick={() => console.log(3)}>
              自定义按钮3
            </Button>,
            <Button type="default" key={3} onClick={() => setVisible(false)}>
              关闭
            </Button>,
          ]}
        >
          代码如写诗
          <br />
          <br />
          写诗如代码
          <br />
          <br />
          这是一门艺术
        </Modal>
      </div>
    </>
  )
}
