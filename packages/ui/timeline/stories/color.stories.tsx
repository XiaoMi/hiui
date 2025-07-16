import React from 'react'
import Timeline from '../src'

/**
 * @title 圆圈颜色
 */
export const Color = () => {
  return (
    <>
      <h1>Color</h1>
      <div className="timeline-color__wrap">
        <Timeline
          style={{ width: 440 }}
          data={[
            {
              title: '管理层例会',
              content: '毕加索会议室 B2层 可提前预定预…',
              timestamp: '10:00',
              extraTime: '02-23',
              dotColor: '#24b237',
              dotType: 'solid',
            },
            {
              title: '社招面试-设计师',
              content: '总参',
              timestamp: '10:00',
              extraTime: '02-27',
              dotColor: '#2660ff',
              dotType: 'solid',
            },
            {
              title: '管理层例会',
              content: '毕加索会议室 B2层 可提前预定预…',
              timestamp: '12:00',
              extraTime: '03-02',
              dotColor: '#fa4646',
              dotType: 'solid',
            },
            {
              title: '社招面试-设计师',
              content: '总参',
              timestamp: '11:00',
              extraTime: '03-10',
              dotColor: '#91959e',
              dotType: 'solid',
            },
          ]}
        />
      </div>
    </>
  )
}
