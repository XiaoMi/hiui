import React from 'react'
import Stepper from '../src'

/**
 * @title 垂直用法
 */
export const Placement = () => {
  const [data] = React.useState([
    {
      title: '账号信息',
      content: '请输入账号信息',
    },
    {
      title: '邮箱激活',
      content: '请输入邮箱',
    },
    {
      title: '信息登记信息登记信息登记信息登记信息登记',
      content: '请输入个人信息',
    },
  ])

  return (
    <>
      <h1>Placement</h1>
      <div className="stepper-placement__wrap">
        <Stepper data={data} current={2} placement="vertical" />
      </div>
    </>
  )
}
