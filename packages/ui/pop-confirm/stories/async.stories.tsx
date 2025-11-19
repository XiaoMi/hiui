import Button from '@hi-ui/button'
import React from 'react'
import PopConfirm from '../src'

/**
 * @title 异步确认关闭
 * @desc 自定义 `footer` 实现自定义确认按钮以及点击事件
 */
export const Async = () => {
  const [visible, setVisible] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  return (
    <>
      <h1>Async</h1>
      <div className="pop-confirm-async__wrap">
        <PopConfirm
          style={{ minWidth: 280 }}
          title="Hello! Are you OK?"
          visible={visible}
          footer={[
            <Button key="1" appearance="line" size="sm" onClick={() => setVisible(false)}>
              取消
            </Button>,
            <Button
              key="2"
              type="primary"
              size="sm"
              loading={loading}
              onClick={() => {
                setLoading(true)
                setTimeout(() => {
                  // setLoading(false)
                  // setVisible(false)
                }, 2000)
              }}
            >
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
