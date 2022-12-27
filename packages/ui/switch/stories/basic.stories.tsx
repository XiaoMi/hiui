import React from 'react'
import Switch from '../src'

/**
 * @title 基础用法
 */
export const Basic = () => {
  return (
    <>
      <h1>状态</h1>
      <div className="switch-basic__wrap">
        <Switch defaultChecked />
      </div>
    </>
  )
}
