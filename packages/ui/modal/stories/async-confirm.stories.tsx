import React from 'react'
import Button from '@hi-ui/button'
import Modal from '../src'

/**
 * @title 异步确认关闭
 * @desc 通过 confirmLoading 控制确定按钮的 loading 状态，实现异步关闭
 */
export const AsyncConfirm = () => {
  const [visible, setVisible] = React.useState(false)
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  console.log('visible', visible)

  return (
    <>
      <h1>AsyncConfirm</h1>
      <div className="modal-async-confirm__wrap">
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <Modal
          title="提示"
          visible={visible}
          closeable={false}
          onCancel={() => setVisible(false)}
          onConfirm={() => {
            console.log('自定义确认事件')

            setConfirmLoading(true)
            setTimeout(() => {
              setVisible(false)
              setConfirmLoading(false)
            }, 1000)
          }}
          confirmLoading={confirmLoading}
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
