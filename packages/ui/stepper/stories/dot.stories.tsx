import React from 'react'
import Stepper from '../src'

/**
 * @title 小圆点
 */
export const Dot = () => {
  const [data1] = React.useState([
    {
      title: '账号信息',
    },
    {
      title: '邮箱激活',
    },
    {
      title: '信息登记',
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
      // content: '请输入个人信息',
    },
  ])

  return (
    <>
      <h1>Dot</h1>
      <div className="stepper-dot__wrap">
        <Stepper data={data1} current={1} type="dot" />
        <br />
        <br />
        <Stepper data={data2} current={2} type="dot" />
      </div>
    </>
  )
}
