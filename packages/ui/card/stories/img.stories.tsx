import React from 'react'
import Card from '../src'

/**
 * @title 带头图
 * @desc 卡片中加入图片，增强识别性，常用于描述应用、项目等
 */
export const Img = () => {
  const [list] = React.useState(() => {
    return new Array(6).fill({
      image: 'http://i1.mifile.cn/f/i/hiui/docs/card/pic_9.png',
      title: '此处展示商品名称',
      content: '此处展示商品相关描述信息',
    })
  })
  return (
    <>
      <h1>Img</h1>
      <div className="card-img__wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {list.map((item, index) => {
          return (
            <Card
              key={index}
              style={{
                width: 256,
                // height: 398,
              }}
              title={item.title}
              coverUrl={item.image}
            >
              <span style={{ fontSize: 12, color: '#60636b' }}>{item.content}</span>
            </Card>
          )
        })}
      </div>
    </>
  )
}
