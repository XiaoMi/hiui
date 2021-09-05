import React from 'react'
import { MockInput } from '../src/MockInput'

export const Mock = () => {
  return (
    <>
      <h1>Mock</h1>
      <div className="input-mock__wrap">
        <p>支持自定义渲染输入框内容，暂时仅供内部 Picker 类组件使用</p>
        <br />
        <MockInput
          clearable
          placeholder="请输入"
          defaultValue={1}
          data={[
            {
              id: 1,
              title: '标题1',
            },
            {
              id: 2,
              title: '标题2',
            },
          ]}
        />
        <br />
        <br />
        <MockInput disabled placeholder="请输入"></MockInput>
      </div>
    </>
  )
}
