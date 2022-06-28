import React from 'react'
import Avatar from '../src'
import { EditOutlined, PlusOutlined } from '@hi-ui/icons'

/**
 * @title 不同内容
 * @desc 支持在头像容器中放置不同的内容元素
 */
export const Content = () => {
  return (
    <>
      <h1>不同内容</h1>
      <div
        className="avatar-content__wrap"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}
      >
        <Avatar />
        <Avatar initials="M" />
        <Avatar icon={<PlusOutlined />} />
        <Avatar>
          <EditOutlined />
        </Avatar>
        <Avatar initials="HiUI" />
        <Avatar src="https://avatars.githubusercontent.com/u/810438?v=4" initials="P" />
        <Avatar>
          <img
            alt="avatar"
            src="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
          />
        </Avatar>
      </div>
    </>
  )
}
