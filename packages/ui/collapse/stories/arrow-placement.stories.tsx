import React from 'react'
import Collapse from '../src'
import { PlusOutlined } from '@hi-ui/icons'
import { IconButton } from '@hi-ui/icon-button'

/**
 * @title 箭头位置
 * @desc 指定箭头放置方式
 */
export const ArrowPlacement = () => {
  return (
    <>
      <h1>ArrowPlacement</h1>
      <div className="collapse-arrow-placement__wrap">
        <Collapse defaultActiveId={['2']} arrowPlacement="right">
          <Collapse.Panel title="小米手机" id="1" disabled>
            <div
              style={{
                backgroundColor: '#f5f7fa',
                textAlign: 'center',
                padding: 32,
                color: '#1f2733',
              }}
            >
              我是小米手机的内容
            </div>
          </Collapse.Panel>
          <Collapse.Panel title="红米手机" id="2">
            <div
              style={{
                backgroundColor: '#f5f7fa',
                textAlign: 'center',
                padding: 32,
                color: '#1f2733',
              }}
            >
              我是红米手机的内容
            </div>
          </Collapse.Panel>
          <Collapse.Panel title="小米笔记本" id="3">
            <div
              style={{
                backgroundColor: '#f5f7fa',
                textAlign: 'center',
                padding: 32,
                color: '#1f2733',
              }}
            >
              我是小米笔记本的内容
            </div>
          </Collapse.Panel>
          <Collapse.Panel
            title="小米 AI"
            id="4"
            extra={
              <IconButton
                style={{ marginInlineEnd: 12 }}
                effect
                icon={<PlusOutlined />}
                onClick={(evt) => evt.stopPropagation()}
              />
            }
          >
            <div
              style={{
                backgroundColor: '#f5f7fa',
                textAlign: 'center',
                padding: 32,
                color: '#1f2733',
              }}
            >
              我是小米 AI 的内容
            </div>
          </Collapse.Panel>
        </Collapse>
      </div>
    </>
  )
}
