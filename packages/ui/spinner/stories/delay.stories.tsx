import React from 'react'
import Button from '@hi-ui/button'
import Space from '@hi-ui/space'
import Spinner from '../src'

/**
 * @title 设置延迟显示时间
 * @desc 当 spinning 装态在 delay 时间内结束，则不显示 loading 状态
 */
export const Delay = () => {
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <h1>Delay</h1>
      <div
        className="spinner-visible__wrap"
        style={{ position: 'relative', width: 500, height: 300 }}
      >
        <Space direction="column">
          <Button
            onClick={() => {
              setVisible((prev) => !prev)
            }}
          >
            Toggle
          </Button>
          <Spinner visible={visible} delay={1000}>
            <div
              style={{
                width: 500,
                height: 300,
                boxSizing: 'border-box',
                background: '#f5f7fa',
                padding: 20,
                border: '20px solid #5f6a7a',
              }}
            />
          </Spinner>
        </Space>
      </div>
    </>
  )
}
