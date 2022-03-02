import React from 'react'
import Stepper from '../src'

const list1 = [
  {
    title: '账号信息',
  },
  {
    title: '邮箱激活',
  },
  {
    title: '信息登记',
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
    // content: '请输入个人信息',
  },
]

export const Dot = () => {
  return (
    <>
      <h1>Dot</h1>
      <div className="stepper-dot__wrap">
        <Stepper data={list1} current={1} type="dot" />
        <br />
        <br />
        <Stepper data={list2} current={2} type="dot" />
      </div>
    </>
  )
}
