import React from 'react'
import Timeline from '../src'
import { EmptyFilled, SunFilled, CheckCircleFilled } from '@hi-ui/icons'

export const CustomIcon = () => {
  return (
    <>
      <h1>CustomIcon</h1>
      <div className="timeline-custom-icon__wrap">
        <Timeline
          data={[
            {
              title: '管理层例会',
              content: '毕加索会议室 B2层 可提前预定预…',
              timestamp: '10:00',
              extraTime: '02-23',

              icon: <SunFilled style={{ color: '#fab007' }} />,
            },
            {
              title: '社招面试-设计师',
              content: '总参',
              timestamp: '10:00',
              extraTime: '02-27',
              icon: <EmptyFilled style={{ color: '#237ffa' }} />,
            },
            {
              title: '管理层例会',
              content: '毕加索会议室 B2层 可提前预定预…',
              timestamp: '12:00',
              extraTime: '03-02',
              icon: <CheckCircleFilled style={{ color: '#14ca64' }} />,
            },
          ]}
        />
      </div>
    </>
  )
}
