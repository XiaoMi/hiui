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
        <h2>自定义文字 </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Switch
            defaultChecked
            content={['开', '关']}
            onChange={(checked) => console.log('change', checked)}
          />
          <Switch
            defaultChecked
            content={['ON', 'OFF']}
            onChange={(checked) => console.log('change', checked)}
          />
        </div>

        <h2>自定义图标 </h2>
        <div>
          <Switch
            defaultChecked
            content={[<CheckOutlined key={1} />, <CloseOutlined key={2} />]}
            onChange={(checked) => console.log('change', checked)}
          />
        </div>
      </div>
    </>
  )
}
