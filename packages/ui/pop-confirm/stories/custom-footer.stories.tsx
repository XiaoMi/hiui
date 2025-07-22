import Button from '@hi-ui/button'
import React from 'react'
import PopConfirm from '../src'

/**
 * @title 自定义底部内容
 */
export const CustomFooter = () => {
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <h1>CustomFooter</h1>
      <div className="pop-confirm-custom-footer__wrap">
        <PopConfirm
          style={{ minWidth: 280 }}
          title="Hello! Are you OK?"
          visible={visible}
          footer={[
            <Button key="1" appearance="line" size="sm" onClick={() => setVisible(false)}>
              取消
            </Button>,
            <Button key="2" type="danger" size="sm" onClick={() => setVisible(false)}>
              确认
            </Button>,
          ]}
        >
          <Button onClick={() => setVisible(true)}>Trigger</Button>
        </PopConfirm>
      </div>
    </>
  )
}
