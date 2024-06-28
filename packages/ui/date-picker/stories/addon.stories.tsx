import React from 'react'
import DatePicker from '../src'
import { AppStoreOutlined } from '@hi-ui/icons'

/**
 * @title 前置后置内容扩展
 */
export const Addon = () => {
  return (
    <div className="date-picker-addon__wrap">
      <h2>Addon</h2>
      <DatePicker
        style={{ width: 240 }}
        onChange={(date, dateStr) => {
          console.log('onChange', date, dateStr)
        }}
        onSelect={console.log}
        prefix={<AppStoreOutlined />}
      />
    </div>
  )
}
