import React from 'react'
import Drawer from '../src'
import Button from '@hi-ui/button'

/**
 * @title 无头抽屉
 * @desc title 不设置任何内容开启无头模式
 */
export const Header = () => {
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <h1>Header</h1>
      <div className="drawer-header__wrap">
        <Button onClick={() => setVisible(!visible)}>open</Button>
        <Drawer closeable={false} visible={visible} onClose={() => setVisible(false)}>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
          <div>我是一段文字，也可以是表单、表格、步骤条等等</div>
        </Drawer>
      </div>
    </>
  )
}
