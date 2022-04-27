import React from 'react'
import Avatar from '../src'

/**
 * @title 不同尺寸
 */
export const Size = () => {
  return (
    <>
      <h1>不同尺寸</h1>
      <div className="avatar-basic__wrap">
        <div style={{ marginBottom: 20 }}>
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            style={{ marginRight: 20 }}
            size="xs"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            style={{ marginRight: 20 }}
            size="sm"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            style={{ marginRight: 20 }}
            size="md"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            style={{ marginRight: 20 }}
            size="lg"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            style={{ marginRight: 20 }}
            size="xl"
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <Avatar initials="P" style={{ marginRight: 20 }} size="xs" />
          <Avatar initials="P" style={{ marginRight: 20 }} size="sm" />
          <Avatar initials="P" style={{ marginRight: 20 }} size="md" />
          <Avatar initials="P" style={{ marginRight: 20 }} size="lg" />
          <Avatar initials="P" style={{ marginRight: 20 }} size="xl" />
        </div>
        <div>
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="square"
            style={{ marginRight: 20 }}
            size="xs"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="square"
            style={{ marginRight: 20 }}
            size="sm"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="square"
            style={{ marginRight: 20 }}
            size="md"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="square"
            style={{ marginRight: 20 }}
            size="lg"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="square"
            style={{ marginRight: 20 }}
            size="xl"
          />
        </div>
      </div>
    </>
  )
}
