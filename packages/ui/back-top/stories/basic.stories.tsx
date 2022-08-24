import React from 'react'
import BackTop from '../src'

/**
 * @title 基础用法
 * @desc 当滚动到设定高度时，会出现回到顶部按钮，点击回到最顶部
 */
export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="back-top-basic__wrap">
        <div style={{ position: 'relative', height: 400 }}>
          <BackTop
            style={{ position: 'absolute' }}
            target={() => document.getElementById('back-top_target') as HTMLElement}
          />
          <div
            id="back-top_target"
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
      <BackTop />
    </>
  )
}
