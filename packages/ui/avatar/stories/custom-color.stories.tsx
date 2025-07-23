import React from 'react'
import Avatar from '../src'

/**
 * @title 自定义颜色
 * @desc 设置 style 自定义头像的背景色
 *
 */
export const CustomColor = () => {
  return (
    <>
      <h1>CustomColor</h1>
      <div
        className="avatar-custom-color__wrap"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}
      >
        <Avatar style={{ backgroundColor: '#2660ff' }} />
        <Avatar style={{ backgroundColor: '#24b237' }} />
        <Avatar style={{ backgroundColor: '#ffbe0a' }} />
        <Avatar style={{ backgroundColor: '#04C2AC' }} />
        <Avatar style={{ backgroundColor: '#7F3DF2' }} />
        <Avatar style={{ backgroundColor: '#4545E6' }} />
        <Avatar style={{ backgroundColor: '#ABADB2' }} />
      </div>
    </>
  )
}
