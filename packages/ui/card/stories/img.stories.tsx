import React from 'react'
import Card from '../src'

/**
 * @title 带头图
 * @desc 卡片中加入图片，增强识别性，常用于描述应用、项目等
 */
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
