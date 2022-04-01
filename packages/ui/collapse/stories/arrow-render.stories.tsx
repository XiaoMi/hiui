import React from 'react'
import Collapse from '../src'
import { FileFilled, FolderFilled, FolderOpenFilled } from '@hi-ui/icons'

export const ArrowRender = () => {
  const [activeId, setActiveId] = React.useState<React.ReactText[]>(['2'])

  return (
    <>
      <h1>ArrowRender</h1>
      <div className="collapse-arrow-render__wrap">
        <Collapse
          arrowPlacement="left"
          activeId={activeId}
          onChange={setActiveId}
          arrowRender={(expanded) => {
            return (
              <span style={{ marginRight: 8, color: '#fab007', fontSize: 16 }}>
                {expanded ? <FolderFilled /> : <FolderOpenFilled />}
              </span>
            )
          }}
        >
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
