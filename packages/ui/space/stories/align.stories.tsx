import React from 'react'
import Space from '../src'
import Avatar from '@hi-ui/avatar'
import Button from '@hi-ui/button'

/**
 * @title 对齐方式
 * @desc 自定义元素之间的对齐方式，默认是居中
 */
export const Align = () => {
  return (
    <>
      <h1>对齐方式</h1>
      <div className="space-basic__wrap">
        <Space size={10}>
          <Space align="flex-start" size="md" style={{ border: '1px solid #f1f1f1', padding: 10 }}>
            <Avatar
              src="https://avatars.githubusercontent.com/u/810438?v=4"
              initials="P"
              size="lg"
            />
            <span>start</span>
            <Button type="primary">button</Button>
          </Space>
          <Space align="center" size="md" style={{ border: '1px solid #f1f1f1', padding: 10 }}>
            <Avatar
              src="https://avatars.githubusercontent.com/u/810438?v=4"
              initials="P"
              size="lg"
            />
            <span>center</span>
            <Button type="primary">button</Button>
          </Space>
          <Space align="flex-end" size="md" style={{ border: '1px solid #f1f1f1', padding: 10 }}>
            <Avatar
              src="https://avatars.githubusercontent.com/u/810438?v=4"
              initials="P"
              size="lg"
            />
            <span>end</span>
            <Button type="primary">button</Button>
          </Space>
        </Space>
      </div>
    </>
  )
}
