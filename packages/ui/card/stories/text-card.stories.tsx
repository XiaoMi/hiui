import React from 'react'
import Card from '../src'

/**
 * @title 文本卡片
 */
export const TextCard = () => {
  return (
    <>
      <h1>文本卡片</h1>
      <div
        className="card-no-header__wrap"
        style={{ padding: 32, backgroundColor: 'rgb(243, 244, 247)' }}
      >
        <Card>
          <div style={{ lineHeight: '24px', fontSize: 16, color: '#1A1D26', fontWeight: 500 }}>
            标题
          </div>
          <div style={{ lineHeight: '20px', fontSize: 12, color: '#606366' }}>这里是辅助描述</div>
          <div style={{ lineHeight: '22px', fontSize: 14, color: '#606366', marginTop: 12 }}>
            这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容这里是文字内容
          </div>
        </Card>
      </div>
    </>
  )
}
