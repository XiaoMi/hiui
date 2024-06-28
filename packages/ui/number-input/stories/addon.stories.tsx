import React from 'react'
import NumberInput from '../src'
import { AppStoreOutlined } from '@hi-ui/icons'

/**
 * @title 前缀后缀内容扩展
 */
export const Addon = () => {
  return (
    <>
      <h1>NumberInput</h1>
      <div className="NumberInput-addon__wrap">
        <NumberInput
          autoFocus
          defaultValue={5}
          min={1}
          placeholder="请输入数字"
          onChange={(v) => console.log('onChange', v)}
          prefix={<AppStoreOutlined />}
        />
      </div>
    </>
  )
}
