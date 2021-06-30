import React from 'react'
import Avatar from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Avatar</h1>
      <div className="avatar-basic__wrap">
        <Avatar src="https://bit.ly/dan-abramov" initials="P" />
      </div>
    </>
  )
}
