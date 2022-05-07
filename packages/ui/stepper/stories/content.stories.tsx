import React from 'react'
import Stepper from '../src'

/**
 * @title 辅助信息
 * @desc 步骤名称不足以表达明确用意，用辅助信息进一步说明
 */
export const Content = () => {
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
      content:
        '请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息请输入个人信息',
    },
  ])

  return (
    <>
      <h1>Content</h1>
      <div className="stepper-content__wrap">
        <Stepper itemLayout="vertical" data={data} current={2} onChange={console.log} />
      </div>
    </>
  )
}
