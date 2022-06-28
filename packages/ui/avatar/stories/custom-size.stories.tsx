import React from 'react'
import Avatar from '../src'

/**
 * @title 自定义尺寸
 * @desc 通过 size 传入数值自定义头像大小
 */
export const CustomSize = () => {
  return (
    <>
      <h1>CustomSize</h1>
      <div
        className="avatar-custom-size__wrap"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}
      >
        <Avatar size={20} initials="P" style={{ backgroundColor: '#237ffa' }} />
        <Avatar size={40} initials="P" style={{ backgroundColor: '#237ffa' }} />
      </div>
    </>
  )
}
