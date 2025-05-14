import React from 'react'
import Drawer from '../src'
import Button from '@hi-ui/button'

/**
 * @title 出现方位
 * @desc 设置抽屉拉出的方向
 */
export const Placement = () => {
  const [visible, setVisible] = React.useState(false)
  const [placement, setPlacement] = React.useState<any>('tpp')

  return (
    <>
      <h1>Placement</h1>
      <div className="drawer-placement__wrap">
        <table className="placement-table" cellSpacing="5">
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td>
                <Button
                  style={{ width: 100 }}
                  onClick={() => {
                    setPlacement('top')
                    setVisible(true)
                  }}
                >
                  top
                </Button>
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>
                <Button
                  style={{ width: 100 }}
                  onClick={() => {
                    setPlacement('left')
                    setVisible(true)
                  }}
                >
                  left
                </Button>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Button
                  style={{ width: 100 }}
                  onClick={() => {
                    setPlacement('right')
                    setVisible(true)
                  }}
                >
                  right
                </Button>
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>
                <Button
                  style={{ width: 100 }}
                  onClick={() => {
                    setPlacement('bottom')
                    setVisible(true)
                  }}
                >
                  bottom
                </Button>
              </td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <Drawer
          title="抽屉标题"
          visible={visible}
          placement={placement}
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
