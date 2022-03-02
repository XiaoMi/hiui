import React from 'react'
import Stepper from '../src'

export const VerticalLayout = () => {
  const list = [
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
  return (
    <>
      <h1>VerticalLayout</h1>
      <div className="stepper-vertical-layout__wrap">
        <Stepper data={list} current={2} placement="vertical" />
      </div>
    </>
  )
}
