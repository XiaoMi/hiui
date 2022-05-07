import React from 'react'
import Switch from '../src'
import { CloseOutlined, CheckOutlined } from '@hi-ui/icons'

/**
 * @title 自定义内容
 */
export const Custom = () => {
  return (
    <>
      <h1>自定义内容</h1>
      <div className="switch-basic__wrap">
        <p>自定义文字 </p>
        <Switch
          content={['开', '关']}
          onChange={(checked) => console.log('change', checked)}
          style={{ marginRight: 8 }}
        />
        <Switch content={['ON', 'OFF']} onChange={(checked) => console.log('change', checked)} />
        <p>自定义图标 </p>
        <Switch
          content={[<CheckOutlined key={1} />, <CloseOutlined key={2} />]}
          onChange={(checked) => console.log('change', checked)}
        />
      </div>
    </>
  )
}
