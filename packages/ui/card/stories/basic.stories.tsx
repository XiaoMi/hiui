import React from 'react'
import Card from '../src'
import Button from '@hi-ui/button'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="card-basic__wrap">
        <Card title="标题" extra={<Button appearance="link">链接</Button>}>
          <div
            style={{
              height: 174,
              backgroundColor: '#F5F7FA',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            此处展示卡片内容
          </div>
        </Card>
        <br />
        <br />
        <Card title="标题" showHeaderDivider extra={<Button appearance="link">链接</Button>}>
          <div
            style={{
              height: 174,
              backgroundColor: '#F5F7FA',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            此处展示卡片内容
          </div>
        </Card>
      </div>
    </>
  )
}
