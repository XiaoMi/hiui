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
        <Button type="primary" style={{ marginBottom: 12, marginLeft: 12 }}>
          Primary Button
        </Button>
        <Button type="secondary" style={{ marginBottom: 12 }}>
          Secondary Button
        </Button>
        <Button style={{ marginBottom: 12 }}>Default Button</Button>
        <Button type="danger" style={{ marginBottom: 12 }}>
          Danger Button
        </Button>
        <Button type="success" style={{ marginBottom: 12 }}>
          Success Button
        </Button>
      </div>
    </>
  )
}
