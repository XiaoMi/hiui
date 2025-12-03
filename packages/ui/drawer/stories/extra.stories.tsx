import React from 'react'
import Drawer from '../src'
import Button from '@hi-ui/button'
import { EditOutlined } from '@hi-ui/icons'

/**
 * @title 顶部额外操作
 */
export const Extra = () => {
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <h1>Extra</h1>
      <div className="drawer-extra">
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <Drawer
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>我是大标题</div>
              <Button
                style={{ marginRight: 20, flexShrink: 0, fontSize: 16 }}
                icon={<EditOutlined />}
                appearance="text"
                size="xs"
              />
            </div>
          }
          visible={visible}
          onClose={() => setVisible(false)}
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
