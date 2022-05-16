import React from 'react'
import Timeline from '../src'
import Card from '@hi-ui/card'

/**
 * @title 卡片内容
 */
export const CardContent = () => {
  return (
    <>
      <h1>卡片内容</h1>
      <div className="timeline-card__wrap" style={{ backgroundColor: '#F2F4F7', padding: 24 }}>
        <Timeline
          data={[
            {
              title: (
                <Card bordered={false}>
                  <div>毕加索会议室 B2层 可提前预定预…</div>
                  <div>毕加索会议室 B2层 可提前预定预…</div>
                  <div>毕加索会议室 B2层 可提前预定预…</div>
                  <div>毕加索会议室 B2层 可提前预定预…</div>
                </Card>
              ),
              timestamp: '10:00',
              extraTime: '02-23',
            },
            {
              title: <Card bordered={false}>社招面试-设计师</Card>,
              timestamp: '10:00',
              extraTime: '02-27',
              children: [
                {
                  title: <Card bordered={false}>Here are some descriptions 1</Card>,
                  timestamp: '10:00',
                  extraTime: '02-23',
                },
                {
                  title: <Card bordered={false}>Here are some descriptions 2</Card>,
                },
              ],
            },
            {
              title: <Card bordered={false}>毕加索会议室 B2层 可提前预定预…</Card>,
              timestamp: '12:00',
              extraTime: '03-02',
            },
            {
              title: (
                <Card bordered={false}>
                  <div>社招面试-设计师</div>
                  <div>社招面试-设计师</div>
                  <div>社招面试-设计师</div>
                  <div>社招面试-设计师</div>
                  <div>社招面试-设计师</div>
                </Card>
              ),
              timestamp: '11:00',
              extraTime: '03-10',
              children: [
                {
                  title: <Card bordered={false}>Here are some descriptions 1</Card>,
                  timestamp: '10:00',
                  extraTime: '02-23',
                },
                {
                  title: <Card bordered={false}>Here are some descriptions 2</Card>,
                },
              ],
            },
          ]}
        />
      </div>
    </>
  )
}
