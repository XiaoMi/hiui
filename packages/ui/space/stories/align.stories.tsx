import React from 'react'
import Space from '../src'
import Avatar from '@hi-ui/avatar'
import Button from '@hi-ui/button'

export const Align = () => {
  return (
    <>
      <h1>对齐方式</h1>
      <div className="space-basic__wrap">
        <Space size="10">
          <Space align="start" size="normal" style={{ border: '1px solid #f1f1f1', padding: 10 }}>
            <Avatar
              src="https://avatars.githubusercontent.com/u/810438?v=4"
              initials="P"
              size="xl"
            />
            <span>HiUI</span>
            <Button type="primary">button</Button>
          </Space>
          <Space align="center" size="normal" style={{ border: '1px solid #f1f1f1', padding: 10 }}>
            <Avatar
              src="https://avatars.githubusercontent.com/u/810438?v=4"
              initials="P"
              size="xl"
            />
            <span>HiUI</span>
            <Button type="primary">button</Button>
          </Space>
          <Space align="end" size="normal" style={{ border: '1px solid #f1f1f1', padding: 10 }}>
            <Avatar
              src="https://avatars.githubusercontent.com/u/810438?v=4"
              initials="P"
              size="xl"
            />
            <span>HiUI</span>
            <Button type="primary">button</Button>
          </Space>
          <Space
            align="baseline"
            size="normal"
            style={{ border: '1px solid #f1f1f1', padding: 10 }}
          >
            <Avatar
              src="https://avatars.githubusercontent.com/u/810438?v=4"
              initials="P"
              size="xl"
            />
            <span>HiUI</span>
            <Button type="primary">button</Button>
          </Space>
        </Space>
      </div>
    </>
  )
}
