import Button from '@hi-ui/button'
import React from 'react'
import Card from '../src'

export const Subtitle = () => {
  return (
    <>
      <h1>Subtitle</h1>
      <div className="card-subtitle__wrap">
        <Card
          title="标题"
          extra={<Button appearance="link">链接</Button>}
          subtitle="这是一句简要的卡片副标题"
        >
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
        <Card
          title="标题"
          showHeaderDivider
          extra={<Button appearance="link">链接</Button>}
          subtitle="这是一句简要的卡片副标题"
        >
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
