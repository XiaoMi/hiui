import React from 'react'
import Avatar from '../src'

export const CustomSize = () => {
  return (
    <>
      <h1>CustomSize</h1>
      <div className="avatar-custom-size__wrap">
        <Avatar size={20} initials="P" style={{ backgroundColor: '#237ffa' }} />
        <Avatar size={40} initials="P" style={{ backgroundColor: '#237ffa' }} />
      </div>
    </>
  )
}
