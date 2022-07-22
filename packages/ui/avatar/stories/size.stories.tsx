import React from 'react'
import Avatar from '../src'

/**
 * @title 不同尺寸
 * @desc 默认支持 5 种头像标准尺寸，通过 size 设置
 */
export const Size = () => {
  return (
    <>
      <h1>不同尺寸</h1>
      <div className="avatar-basic__wrap">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 24,
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Avatar src="https://avatars.githubusercontent.com/u/810438?v=4" initials="P" size="xs" />
          <Avatar src="https://avatars.githubusercontent.com/u/810438?v=4" initials="P" size="sm" />
          <Avatar src="https://avatars.githubusercontent.com/u/810438?v=4" initials="P" size="md" />
          <Avatar src="https://avatars.githubusercontent.com/u/810438?v=4" initials="P" size="lg" />
          <Avatar src="https://avatars.githubusercontent.com/u/810438?v=4" initials="P" size="xl" />
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 24,
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Avatar initials="P" size="xs" />
          <Avatar initials="P" size="sm" />
          <Avatar initials="P" size="md" />
          <Avatar initials="P" size="lg" />
          <Avatar initials="P" size="xl" />
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 24,
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="square"
            size="xs"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="square"
            size="sm"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="square"
            size="md"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="square"
            size="lg"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="square"
            size="xl"
          />
        </div>
      </div>
    </>
  )
}
