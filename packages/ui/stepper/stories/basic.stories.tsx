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
    },
    {
      title: '邮箱激活',
    },
    {
      title: '信息登记',
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
