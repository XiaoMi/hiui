import React from 'react'
import Button from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Button</h1>
      <div className="button-basic__wrap">
        <Button loading appearance="link">
          取消
        </Button>
        <Button>提交</Button>
      </div>
    </>
  )
}
