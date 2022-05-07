import React from 'react'
import Timeline from '../src'
import HiCard from '@hi-ui/card'

/**
 * @title 卡片内容
 */
export const Card = () => {
  return (
    <>
      <h1>Card</h1>
      <div className="timeline-card__wrap" style={{ backgroundColor: '#F2F4F7', padding: 24 }}>
        <Timeline
          data={[
            {
              title: (
                <HiCard bordered={false}>
                  <div>毕加索会议室 B2层 可提前预定预…</div>
                  <div>毕加索会议室 B2层 可提前预定预…</div>
                  <div>毕加索会议室 B2层 可提前预定预…</div>
                  <div>毕加索会议室 B2层 可提前预定预…</div>
                </HiCard>
              ),
              timestamp: '10:00',
              extraTime: '02-23',
            },
            {
              title: <HiCard bordered={false}>社招面试-设计师</HiCard>,
              timestamp: '10:00',
              extraTime: '02-27',
              children: [
                {
                  title: <HiCard bordered={false}>Here are some descriptions 1</HiCard>,
                  timestamp: '10:00',
                  extraTime: '02-23',
                },
                {
                  title: <HiCard bordered={false}>Here are some descriptions 2</HiCard>,
                },
              ],
            },
            {
              title: <HiCard bordered={false}>毕加索会议室 B2层 可提前预定预…</HiCard>,
              timestamp: '12:00',
              extraTime: '03-02',
            },
            {
              title: (
                <HiCard bordered={false}>
                  <div>社招面试-设计师</div>
                  <div>社招面试-设计师</div>
                  <div>社招面试-设计师</div>
                  <div>社招面试-设计师</div>
                  <div>社招面试-设计师</div>
                </HiCard>
              ),
              timestamp: '11:00',
              extraTime: '03-10',
              children: [
                {
                  title: <HiCard bordered={false}>Here are some descriptions 1</HiCard>,
                  timestamp: '10:00',
                  extraTime: '02-23',
                },
                {
                  title: <HiCard bordered={false}>Here are some descriptions 2</HiCard>,
                },
              ],
            },
          ]}
        />
      </div>
    </>
  )
}
