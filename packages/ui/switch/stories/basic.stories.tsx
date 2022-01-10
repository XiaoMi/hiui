import React from 'react'
import Switch from '../src'

export const Basic = () => {
  return (
    <>
      <h1>状态</h1>
      <div className="switch-basic__wrap">
        <p>切换</p>
        <Switch defaultChecked />
        <p>开启</p>
        <Switch checked />
        <p>关闭</p>
        <Switch checked={false} />
        <p>禁用</p>
        <Switch disabled checked />
        <br />
        <Switch disabled checked={false} />
      </div>
    </>
  )
}
