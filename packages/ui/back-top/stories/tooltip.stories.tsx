import React from 'react'
import BackTop from '../src'

/**
 * @title 设置 Tooltip
 * @desc 详见 Tooltip 组件参数设置
 */
export const Tooltip = () => {
  return (
    <>
      <h1>设置 Tooltip</h1>
      <div className="back-top-basic__wrap">
        <div style={{ position: 'relative', height: 400 }}>
          <BackTop
            style={{ position: 'absolute' }}
            tooltipProps={{ title: 'Back to the top' }}
            target={() => document.getElementById('back-top_tooltip') as HTMLElement}
          />
          <div
            id="back-top_tooltip"
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
