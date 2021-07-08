import React from 'react'
import Switch from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Switch</h1>
      <div className="switch-basic__wrap">
        <p>默认</p>
        <Switch />
        <p>自定义内容</p>
        <Switch content={['ON', 'OFF']} onChange={() => console.log('change')} />
        <p>自定义图标 </p>
      </div>
    </>
  )
}
