import React from 'react'
import Alert from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Alert</h1>
      <div className="alert-basic__wrap">
        <Alert title="信息提示的文案" closeable />
      </div>
    </>
  )
}
