import React from 'react'
import Collapse from '../src'
import { IconButton } from '@hi-ui/icon-button'
import { EditOutlined } from '@hi-ui/icons'

/**
 * @title 手风琴模式
 * @desc 一次仅展开一个面板，有效减少垂直空间的占用
 */
export const Accordion = () => {
  return (
    <>
      <h1>Accordion</h1>
      <div className="collapse-accordion__wrap">
        <Collapse defaultActiveId={['2']} arrowPlacement="left" accordion>
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
          <Collapse.Panel
            title="红米手机"
            id="2"
            extra={
              <IconButton
                style={{ marginInlineEnd: 12 }}
                icon={<EditOutlined />}
                onClick={(evt) => evt.stopPropagation()}
                effect
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
          <Collapse.Panel title="小米 AI" id="4">
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
