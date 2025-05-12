import React from 'react'
import Button from '../src'

/**
 * @title 文本链接
 * @desc 执行操作时发出页面请求，页面会给予明确的反馈
 */
export const Text = () => {
  return (
    <>
      <h1>Button</h1>
      <div className="button-basic__wrap">
        <Button type="primary" appearance="text">
          主要按钮
        </Button>
        <Button type="secondary" appearance="text">
          次要按钮
        </Button>
        <Button type="default" appearance="text">
          中性按钮
        </Button>
        <Button type="danger" appearance="text">
          危险按钮
        </Button>
        <Button type="success" appearance="text">
          成功按钮
        </Button>
      </div>
    </>
  )
}
