import React from 'react'
import Stepper from '../src'
import { UserOutlined } from '@hi-ui/icons'

const list = [
  {
    title: '账号信息',
    icon: <UserOutlined />,
  },
  {
    title: '邮箱激活',
  },
  {
    title: '信息登记',
    icon: <UserOutlined />,
  },
]

const list2 = [
  {
    title: '账号信息',
    content: '请输入账号信息',
  },
  {
    title: '邮箱激活',
    content: '请输入邮箱',
  },
  {
    title: '信息登记',
    content:
      '请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息',
  },
]

export const ItemLayout = () => {
  return (
    <>
      <h1>ItemLayout</h1>
      <div className="stepper-item-vertical__wrap">
        <Stepper itemLayout="vertical" data={list} current={1} type="dot" onChange={console.log} />
        <br />
        <br />
        <Stepper data={list2} current={2} itemLayout="vertical" />
        <br />
        <br />
        <Stepper data={list2} current={3} itemLayout="vertical" type="dot" />
      </div>
    </>
  )
}
