import React from 'react'
import Stepper from '../src'
import { UserOutlined } from '@hi-ui/icons'

/**
 * @title 标题结构
 * @desc 步骤与内容通过左右结构可以有效利用页面空间
 */
export const ItemLayout = () => {
  const [data1] = React.useState([
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
  ])

  const [data2] = React.useState([
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
  ])

  return (
    <>
      <h1>ItemLayout</h1>
      <div className="stepper-item-vertical__wrap">
        <Stepper itemLayout="vertical" data={data1} current={1} type="dot" onChange={console.log} />
        <br />
        <br />
        <Stepper data={data2} current={2} itemLayout="vertical" />
        <br />
        <br />
        <Stepper data={data2} current={3} itemLayout="vertical" type="dot" />
      </div>
    </>
  )
}
