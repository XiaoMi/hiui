import React from 'react'
import Avatar from '../src'

/**
 * @title 基础用法
 * @desc 提供基础的默认头像
 */
export const Basic = () => {
  return (
    <>
      <h1>Avatar</h1>
      <div
        className="avatar-basic__wrap"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}
      >
        <Avatar bordered />
      </div>
    </>
  )
}
