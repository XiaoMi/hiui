import React from 'react'
import Result from '../src'
import Button from '@hi-ui/button'
import { QuestionCircleFilled } from '@hi-ui/icons'

export const Custom = () => {
  return (
    <>
      <h1>自定义图标</h1>
      <div className="result-basic__wrap" style={{ width: '760px' }}>
        <Result
          image={
            <QuestionCircleFilled
              style={{ width: '64px', height: '64px', padding: '18px', color: '#237FFA' }}
            />
          }
          title="这是一条自定义内容"
          content="这是对自定义内容的说明文案"
          children={[
            <Button key="refresh">重试</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
        <Result
          image={
            <QuestionCircleFilled
              style={{ width: '88px', height: '88px', padding: '26px', color: '#237FFA' }}
            />
          }
          title="这是一条自定义内容"
          content="这是对自定义内容的说明文案"
          children={[
            <Button key="refresh">重试</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
        <Result
          image={
            <QuestionCircleFilled
              style={{ width: '114px', height: '114px', padding: '33px', color: '#237FFA' }}
            />
          }
          title="这是一条自定义内容"
          content="这是对自定义内容的说明文案"
          children={[
            <Button key="refresh">重试</Button>,
            <Button type="primary" key="back">
              返回
            </Button>,
          ]}
        />
      </div>
    </>
  )
}
