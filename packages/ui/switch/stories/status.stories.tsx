import React from 'react'
import Switch from '../src'

/**
 * @title 不同状态
 */
export const Status = () => {
  return (
    <>
      <h1>状态</h1>
      <div className="switch-basic__wrap">
        <p>默认</p>
        <Switch defaultChecked />
        <p>受控开启</p>
        <Switch checked />
        <p>受控关闭</p>
        <Switch checked={false} />
        <p>禁用</p>
        <Switch disabled checked />
        <br />
        <Switch disabled checked={false} />
      </div>
    </>
  )
}
