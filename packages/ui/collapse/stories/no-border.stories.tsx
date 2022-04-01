import React from 'react'
import Collapse from '../src'
import { FileFilled } from '@hi-ui/icons'

export const bordered = () => {
  return (
    <>
      <h1>Bordered</h1>
      <div
        className="collapse-bordered__wrap"
        style={{
          backgroundColor: '#F5F7FA',
          padding: 24,
        }}
      >
        <Collapse defaultActiveId={['2']} arrowPlacement="left" bordered={false}>
          <Collapse.Panel title="小米手机" id="1" disabled>
            我是小米手机的内容
          </Collapse.Panel>
          <Collapse.Panel title="红米手机" id="2">
            我是红米手机的内容
          </Collapse.Panel>
          <Collapse.Panel title="小米笔记本" id="3">
            我是小米笔记本的内容
          </Collapse.Panel>
          <Collapse.Panel title="小米 AI" id="4" extra={<FileFilled />}>
            我是小米 AI 的内容
          </Collapse.Panel>
        </Collapse>
      </div>
    </>
  )
}
