import React from 'react'
import ToastAPI from '../src'
import Button from '@hi-ui/button'

const Toast = ToastAPI.create({ prefixCls: 'basic' })

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="toast-basic__wrap">
        <Button
          onClick={() => {
            Toast.open({
              title: 'xxxx',
            })
          }}
        >
          Toast
        </Button>

        <Button
          onClick={() => {
            Toast.destroy()
          }}
        >
          Destroy Toast
        </Button>
      </div>
    </>
  )
}
