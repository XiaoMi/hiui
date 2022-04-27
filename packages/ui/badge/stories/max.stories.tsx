import React from 'react'
import Badge from '../src'
import { Avatar } from '@hi-ui/avatar'

/**
 * @title 数值显示上限
 */
export const Max = () => {
  return (
    <>
      <h1>数值显示上限</h1>
      <div className="badge-max__wrap">
        <Badge content={2000} max={999}>
          <Avatar src="https://avatars.githubusercontent.com/u/810438?v=4" initials="P" />
        </Badge>
      </div>
    </>
  )
}
