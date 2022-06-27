import React from 'react'
import Dropdown from '../src'

/**
 * @title 分组
 * @desc 通过分隔线将选项进行分组划分
 */
export const Group = () => {
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
      split: true,
    },
    {
      id: 6,
      title: '小米商城',
      href: 'https://www.mi.com',
      disabled: true,
    },
  ])

  return (
    <>
      <h1>Group</h1>
      <div className="dropdown-group__wrap">
        <Dropdown data={list} title="鼠标悬停" onClick={console.log} />
      </div>
    </>
  )
}
