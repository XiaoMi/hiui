import React from 'react'
import Button from '../src'

/**
 * @title 基础用法
 */
export const Basic = () => {
  return (
    <>
      <h1>不同类型</h1>
      <div className="button-basic__wrap">
        <Button type="primary">Primary Button</Button>
        <Button type="default">Default Button</Button>
        <Button type="danger">Danger Button</Button>
        <Button type="success">Success Button</Button>
      </div>
    </>
  )
}
