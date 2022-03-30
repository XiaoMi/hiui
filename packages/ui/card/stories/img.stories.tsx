import React from 'react'
import Card from '../src'

export const Img = () => {
  return (
    <>
      <h1>Img</h1>
      <div className="card-img__wrap">
        <Card coverUrl="http://i1.mifile.cn/f/i/hiui/docs/card/pic_9.png">带图片卡片内容</Card>
        <br />
        <br />
        <Card title="卡片标题" coverUrl="http://i1.mifile.cn/f/i/hiui/docs/card/pic_9.png">
          带图片卡片内容
        </Card>
      </div>
    </>
  )
}
