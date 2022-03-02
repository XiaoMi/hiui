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
    content: '请输入个人信息',
  },
]

export const Vertical = () => {
  return (
    <>
      <h1>Vertical</h1>
      <div className="stepper-vertical__wrap">
        <Stepper itemLayout="vertical" data={list} current={1} type="dot" />
        <br />
        <br />
        <Stepper data={list2} current={2} itemLayout="vertical" />
      </div>
    </>
  )
}
