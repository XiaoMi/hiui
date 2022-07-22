import React from 'react'
import Dropdown from '../src'

/**
 * @title 基础用法
 * @desc 将一组同类的动作收起成为菜单，由一个操作入口展示使用
 */
export const Basic = () => {
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
  ])

  return (
    <>
      <h1>Basic</h1>
      <div className="dropdown-basic__wrap">
        <Dropdown data={list} title="鼠标悬停" onClick={console.log} />
      </div>
    </>
  )
}
