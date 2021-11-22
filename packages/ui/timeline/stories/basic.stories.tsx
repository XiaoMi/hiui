import React from 'react'
import Timeline from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="timeline-basic__wrap">
        <Timeline
          data={[
            {
              title: '管理层例会',
              content: '毕加索会议室 B2层 可提前预定预…',
              timestamp: '10:00',
              extraTime: '02-23',
            },
            {
              title: '社招面试-设计师',
              content: '总参',
              timestamp: '10:00',
              extraTime: '02-27',
            },
            {
              title: '管理层例会',
              content: '毕加索会议室 B2层 可提前预定预…',
              timestamp: '12:00',
              extraTime: '03-02',
            },
            {
              title: '社招面试-设计师',
              content: '总参',
              timestamp: '11:00',
              extraTime: '03-10',
            },
          ]}
        />
      </div>
    </>
  )
}
