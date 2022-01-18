import Button from '@hi-ui/button'
import React from 'react'
import PopConfirm from '../src'

export const Async = () => {
  const [visible, setVisible] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  return (
    <>
      <h1>Async</h1>
      <div className="pop-confirm-async__wrap">
        <PopConfirm
          title="Are U ok ?"
          visible={visible}
          footer={[
            <Button key="1" type="default" size="small" onClick={() => setVisible(false)}>
              取消
            </Button>,
            <Button
              key="2"
              type="primary"
              size="small"
              loading={loading}
              onClick={() => {
                setLoading(true)
                setTimeout(() => {
                  setLoading(false)
                  setVisible(false)
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
