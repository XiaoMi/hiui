import React from 'react'
import Stepper from '../src'

/**
 * @title 标题结构
 * @desc 步骤与内容通过上下结构可以有效利用页面空间
 */
export const ItemLayout = () => {
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
      title: '信息登记',
      content: '请输入个人信息',
    },
  ])

  return (
    <>
      <h1>ItemLayout</h1>
      <div className="stepper-item-vertical__wrap">
        <Stepper data={data} current={2} itemLayout="vertical" />
        <br />
        <br />
        <Stepper data={data} current={3} itemLayout="vertical" type="dot" />
      </div>
    </>
  )
}
