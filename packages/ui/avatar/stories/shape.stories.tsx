import React from 'react'
import Avatar from '../src'

export const Shape = () => {
  return (
    <>
      <h1>不同形状</h1>
      <div className="avatar-basic__wrap">
        <Avatar
          src="https://avatars.githubusercontent.com/u/810438?v=4"
          initials="P"
          style={{ marginRight: 20 }}
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
