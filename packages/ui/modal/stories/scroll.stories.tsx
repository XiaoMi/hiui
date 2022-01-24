import React from 'react'
import Button from '@hi-ui/button'
import Modal from '../src'

export const Scroll = () => {
  const [visible, setVisible] = React.useState(false)
  console.log('visible', visible)

  return (
    <>
      <h1>Scroll</h1>
      <div className="modal-scroll__wrap">
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <Modal visible={visible} title="弹框的滚动标题" onCancel={() => setVisible(false)}>
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
