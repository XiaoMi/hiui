import React from 'react'
import Timeline from '../src'

/**
 * @title 内容分组
 */
export const Group = () => {
  return (
    <>
      <h1>Group</h1>
      <div className="timeline-group__wrap">
        <Timeline
          data={[
            {
              groupTitle: '上午',
              children: [
                {
                  title: '管理层例会',
                  content: '毕加索会议室 B2层 可提前预定预…',
                  timestamp: '10:00',
                },
                {
                  title: '社招面试-设计师',
                  content: '总参',
                  timestamp: '10:00',
                },
              ],
            },
            {
              groupTitle: '下午',
              children: [
                {
                  title: '管理层例会',
                  content: '毕加索会议室 B2层 可提前预定预…',
                  timestamp: '12:00',
                },
                {
                  title: '社招面试-设计师',
                  content: '总参',
                  timestamp: '11:00',
                },
              ],
            },
          ]}
        />
      </div>
    </>
  )
}
