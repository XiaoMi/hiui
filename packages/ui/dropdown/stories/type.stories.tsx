import React from 'react'
import Dropdown from '../src'
import message from '@hi-ui/message'

export const Type = () => {
  const [list] = React.useState([
    {
      id: 0,
      title: '小米商城',
      href: 'https://www.mi.com',
    },
    {
      id: 1,
      title: '菜单二',
    },
    {
      id: 2,
      title: '菜单三',
    },
    {
      id: 3,
      title: '菜单四',
    },
    {
      id: 4,
      title: '菜单五',
    },
    {
      id: 5,
      title: '菜单六',
    },
    {
      id: 6,
      title: '菜单七',
    },
    {
      id: 7,
      title: '-',
    },
    {
      id: 8,
      title: '小米商城',
      href: 'https://www.mi.com',
      disabled: true,
    },
  ])

  return (
    <>
      <h1>Type</h1>
      <div className="dropdown-type__wrap">
        <Dropdown type="text" data={list} title="鼠标悬停" onClick={console.log} />
        <br />
        <br />
        <Dropdown type="button" data={list} title="鼠标悬停" onClick={console.log} />
        <br />
        <br />
        <Dropdown
          type="group"
          data={list}
          title="鼠标悬停"
          onClick={console.log}
          onButtonClick={() => {
            message.open({ title: '点击左侧按钮' })
          }}
        />
      </div>
    </>
  )
}
