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
        <h2>默认</h2>
        <div>
          <Switch defaultChecked />
        </div>

        <h2>受控开启</h2>
        <div>
          <Switch checked />
        </div>

        <h2>受控关闭</h2>
        <Switch checked={false} />

        <h2>禁用</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Switch disabled checked />
          <Switch disabled checked={false} />
        </div>
      </div>
    </>
  )
}
