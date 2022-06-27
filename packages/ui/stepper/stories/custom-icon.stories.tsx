import React from 'react'
import Stepper from '../src'
import { TimeOutlined, UserOutlined } from '@hi-ui/icons'

/**
 * @title 图标用法
 * @desc 每个步骤可用图标明确表示含义，带来丰富生动的效果
 */
export const CustomIcon = () => {
  const [data] = React.useState([
    {
      title: '账号信息',
      icon: <UserOutlined />,
    },
    {
      title: '邮箱激活',
      icon: <TimeOutlined />,
    },
    {
      title: '信息登记',
      icon: <UserOutlined />,
    },
  ])

  return (
    <>
      <h1>CustomIcon</h1>
      <div className="stepper-custom-icon__wrap">
        <Stepper
          data={data}
          current={2}
          itemLayout="vertical"
          // type="dot"
          onChange={console.log}
        />
      </div>
    </>
  )
}
