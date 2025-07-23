import React from 'react'
import { EllipsisOutlined } from '@hi-ui/icons'
import Avatar from '../src'

/**
 * @title 头像组
 * @desc 通过 AvatarGroup 包裹多个 Avatar 组件，可以实现头像组的效果
 */
export const Group = () => {
  return (
    <>
      <h1>头像组</h1>
      <div className="avatar-group__wrap">
        <h4>基本用法</h4>
        <Avatar.Group maxCount={3}>
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="circle"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="circle"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="circle"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="circle"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="circle"
          />
        </Avatar.Group>

        <br />

        <h4>配置更多按钮</h4>
        <Avatar.Group
          maxCount={3}
          moreButton={{
            text: <EllipsisOutlined />,
            // style: { backgroundColor: '#74a2ff', color: '#fff' },
          }}
        >
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="circle"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="circle"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="circle"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="circle"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="circle"
          />
        </Avatar.Group>

        <br />

        <h4>配置更多头像弹窗</h4>
        <Avatar.Group
          maxCount={3}
          morePopover={{
            trigger: 'click',
            // content: <div>自定义更多头像展示方式</div>,
            style: { maxWidth: 420 },
          }}
        >
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="circle"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="circle"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="circle"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="circle"
          />
          <Avatar
            src="https://avatars.githubusercontent.com/u/810438?v=4"
            initials="P"
            shape="circle"
          />
        </Avatar.Group>
      </div>
    </>
  )
}
