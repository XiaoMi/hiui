import React from 'react'
import Avatar from '../src'

/**
 * @title 不同形状
 * @desc 通过 shape 指定头像的形状
 */
export const Shape = () => {
  return (
    <>
      <h1>不同形状</h1>
      <div
        className="avatar-basic__wrap"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}
      >
        <Avatar
          src="https://avatars.githubusercontent.com/u/810438?v=4"
          initials="P"
          shape="circle"
        />
        <Avatar
          src="https://avatars.githubusercontent.com/u/810438?v=4"
          initials="P"
          shape="square"
        />
      </div>
    </>
  )
}
