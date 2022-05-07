import React from 'react'
import Stepper from '../src'

/**
 * @title 基础用法
 * @desc 一个复杂任务需要拆分多个步骤完成，步骤数量不宜过多，4-7个为宜
 */
export const Basic = () => {
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
      title: '建议不超过8个字符信息登记',
      content: '请输入个人信息请输入个人信息请输入个人信息请输入个人信息',
    },
  ])

  return (
    <>
      <h1>Stepper</h1>
      <div className="stepper-basic__wrap">
        <Stepper data={data} current={2} />
      </div>
    </>
  )
}
