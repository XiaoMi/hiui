import React from 'react'
import Stepper from '../src'

const list = [
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
    content: '请输入个人信息',
  },
]

export const Basic = () => {
  return (
    <>
      <h1>Stepper</h1>
      <div className="stepper-basic__wrap">
        <Stepper data={list} current={1} />
        <Stepper data={list2} current={2} />
      </div>
    </>
  )
}
