import React from 'react'
import Button from '@hi-ui/button'
import Modal from '../src'

/**
 * @title 内容溢出滚动
 */
export const Scroll = () => {
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <h1>Scroll</h1>
      <div className="modal-scroll__wrap">
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <Modal title="弹窗标题" visible={visible} onCancel={() => setVisible(false)}>
          <div>
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区 模拟超长的内容区 模拟超长的内容区 模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
            <br />
            模拟超长的内容区
          </div>
        </Modal>
      </div>
    </>
  )
}
