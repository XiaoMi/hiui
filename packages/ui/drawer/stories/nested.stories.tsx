import React from 'react'
import Button from '@hi-ui/button'
import Drawer from '../src'

/**
 * @title 嵌套抽屉
 */
export const Nested = () => {
  const [visible, setVisible] = React.useState(false)
  const [nestVisible, setNestVisible] = React.useState(false)

  return (
    <>
      <h1>Nested</h1>
      <div className="Drawer-nested__wrap">
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <Drawer
          title="抽屉标题"
          width={754}
          visible={visible}
          closeable={false}
          onClose={() => setVisible(false)}
        >
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <Button style={{ marginTop: 20 }} onClick={() => setNestVisible(!nestVisible)}>
            Nested
          </Button>
          <Drawer
            title="抽屉标题"
            visible={nestVisible}
            closeable={false}
            onClose={() => setNestVisible(false)}
          >
            Nest我是一段文字，也可以是表单、表格、步骤条等等
          </Drawer>
        </Drawer>
      </div>
    </>
  )
}
