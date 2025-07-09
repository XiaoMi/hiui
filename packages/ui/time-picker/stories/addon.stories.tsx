import React, { useState } from 'react'
import TimePicker from '../src'
import { AppStoreOutlined } from '@hi-ui/icons'

/**
 * @title 前内置元素
 */
export const Addon = () => {
  const [addonValue, setAddonValue] = useState<string | string[]>(['12:00:00'])

  return (
    <>
      <h1>Addon</h1>
      <div className="time-picker-addon__wrap">
        <TimePicker
          style={{ width: '240px' }}
          placeholder={['请选择时间']}
          value={addonValue}
          onChange={(e) => {
            console.log('basic-default', e)
            setAddonValue(e)
          }}
          prefix={<AppStoreOutlined />}
        />
      </div>
    </>
  )
}
