import React from 'react'
import NumberInput from '../src'
import { AppStoreOutlined } from '@hi-ui/icons'

/**
 * @title 前内置元素
 */
export const Addon = () => {
  return (
    <>
      <h1>NumberInput</h1>
      <div className="NumberInput-addon__wrap">
        <NumberInput
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
