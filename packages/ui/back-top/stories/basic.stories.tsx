import React from 'react'
import Tooltip from '@hi-ui/tooltip'
import { ArrowUpOutlined } from '@hi-ui/icons'
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
            container={() => document.getElementById('back-top_target')}
          />
          <div
            id="back-top_target"
            style={{ position: 'relative', height: 400, overflowY: 'scroll' }}
          >
            {Array.from({ length: 10 }, (_, index) => (
              <div key={index} style={{ padding: 30, background: '#f2f3f7' }}>
                页面内容{index}
              </div>
            ))}
          </div>
        </div>
      </div>
      <BackTop>
        <Tooltip title="回到顶部" placement="left" disabledPortal={true}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              color: '#fff',
              background: '#237ffa',
            }}
          >
            <ArrowUpOutlined />
          </div>
        </Tooltip>
      </BackTop>
    </>
  )
}
