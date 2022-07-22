import React from 'react'
import Toast from '../src'
import Button from '@hi-ui/button'

/**
 * @title 基础用法
 */
export const Basic = () => {
  const ToastAPI = React.useMemo(() => Toast.create({ prefixCls: 'basic' }), [])

  return (
    <>
      <h1>Basic</h1>
      <div className="toast-basic__wrap">
        <Button
          onClick={() => {
            ToastAPI.open({
              title: 'xxxx',
            })
          }}
        >
          Toast
        </Button>

        <Button
          onClick={() => {
            ToastAPI.destroy()
          }}
        >
          Destroy Toast
        </Button>
      </div>
    </>
  )
}
