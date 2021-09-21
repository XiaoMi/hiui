import React from 'react'
import Avatar from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Avatar</h1>
      <div className="avatar-basic__wrap">
        <Avatar src="https://avatars.githubusercontent.com/u/810438?v=4" initials="P" />
      </div>
    </>
  )
}
