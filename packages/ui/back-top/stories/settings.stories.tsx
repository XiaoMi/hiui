import React, { useState } from 'react'
import Space from '@hi-ui/space'
import Select from '@hi-ui/select'
import Input from '@hi-ui/input'
import BackTop from '../src'

/**
 * @title 参数设置
 * @desc 设置按钮形状、主题、滚动时间、滚动到多高时显示
 */
export const Settings = () => {
  const [shape, setShape] = useState<any>('circle')
  const [duration, setDuration] = useState<any>(400)
  const [visibleHeight, setVisibleHeight] = useState<any>(400)

  return (
    <>
      <h1>设置按钮形状、主题、滚动时间、滚动到多高时显示</h1>
      <div className="back-top-basic__wrap">
        <Space style={{ marginBottom: 20 }}>
          <span>形状</span>
          <Select
            style={{ width: 110, marginRight: 20 }}
            clearable={false}
            value={shape}
            onChange={setShape}
            data={[
              { id: 'circle', title: '圆形' },
              { id: 'square', title: '圆角矩形' },
            ]}
          />
          <span>滚动时间(ms)</span>
          <Input
            value={duration}
            onChange={(data) => setDuration(data.target.value)}
            style={{ width: 110, marginRight: 20 }}
          />
          <span>visibleHeight</span>
          <Input
            value={visibleHeight}
            onChange={(data) => setVisibleHeight(data.target.value)}
            style={{ width: 110 }}
          />
        </Space>
        <div style={{ position: 'relative', height: 400 }}>
          <BackTop
            shape={shape}
            duration={duration}
            visibleHeight={visibleHeight}
            style={{ position: 'absolute' }}
            container={() => document.getElementById('back-top_setting') as HTMLElement}
          />
          <div
            id="back-top_setting"
            style={{ position: 'relative', height: 400, overflowY: 'scroll' }}
          >
            <div style={{ padding: 30, background: '#f3f2f9' }}>页面内容1</div>
            <div style={{ padding: 30, background: '#f3f2f9' }}>页面内容2</div>
            <div style={{ padding: 30, background: '#f3f2f9' }}>页面内容3</div>
            <div style={{ padding: 30, background: '#f3f2f9' }}>页面内容4</div>
            <div style={{ padding: 30, background: '#f3f2f9' }}>页面内容5</div>
            <div style={{ padding: 30, background: '#f3f2f9' }}>页面内容6</div>
            <div style={{ padding: 30, background: '#f3f2f9' }}>页面内容7</div>
            <div style={{ padding: 30, background: '#f3f2f9' }}>页面内容8</div>
            <div style={{ padding: 30, background: '#f3f2f9' }}>页面内容9</div>
            <div style={{ padding: 30, background: '#f3f2f9' }}>页面内容10</div>
          </div>
        </div>
      </div>
    </>
  )
}
