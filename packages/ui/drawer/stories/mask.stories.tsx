import React from 'react'
import Drawer from '../src'
import Button from '@hi-ui/button'

/**
 * @title 无蒙层
 */
export const Mask = () => {
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <h1>Mask</h1>
      <div className="drawer-mask__wrap">
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <Drawer
          title="抽屉标题"
          visible={visible}
          showMask={false}
          onClose={() => setVisible(false)}
          footer={
            <div style={{ textAlign: 'right' }}>
              <Button type="default" appearance="line" key={1} onClick={() => console.log(2)}>
                取消
              </Button>
              <Button type="primary" key={0} onClick={() => console.log(1)}>
                确认
              </Button>
            </div>
          }
        >
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
        </Drawer>
      </div>
    </>
  )
}
