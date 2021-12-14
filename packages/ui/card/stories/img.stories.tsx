import React from 'react'
import Card from '../src'

export const Img = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="card-basic__wrap">
        <Card style={{ width: 600 }} coverURL="http://i1.mifile.cn/f/i/hiui/docs/card/pic_9.png">
          基础卡片
        </Card>
        <Card
          style={{ width: 600 }}
          title="卡片标题"
          coverURL="http://i1.mifile.cn/f/i/hiui/docs/card/pic_9.png"
        >
          基础卡片
        </Card>
      </div>
    </>
  )
}
