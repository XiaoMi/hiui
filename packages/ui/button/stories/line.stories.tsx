import React from 'react'
import Button from '../src'

/**
 * @title 线性风格
 */
export const Line = () => {
  return (
    <>
      <h1>Button</h1>
      <div className="button-basic__wrap">
        <Button type="primary" appearance="line">
          主要按钮
        </Button>
        <Button type="secondary" appearance="line">
          次要按钮
        </Button>
        <Button type="default" appearance="line">
          中性按钮
        </Button>
        <Button type="danger" appearance="line">
          危险按钮
        </Button>
        <Button type="success" appearance="line">
          成功按钮
        </Button>
      </div>
    </>
  )
}
