import React from 'react'
import Timeline from '../src'

export const Right = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="timeline-basic__wrap">
        <Timeline
          type="right"
          data={[
            {
              title: '信息部全员财务培训需求收集',
              content:
                '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
              timestamp: '10:00',
              extraTime: '02-23',
            },
            {
              title: '信息部全员财务培训需求收集',
              content:
                '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
              timestamp: '10:00',
              extraTime: '02-27',
            },
            {
              title: '信息部全员财务培训需求收集',
              content:
                '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
              timestamp: '12:00',
              extraTime: '03-02',
            },
            {
              title: '信息部全员财务培训需求收集',
              content:
                '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
              timestamp: '11:00',
              extraTime: '03-10',
            },
          ]}
        />
      </div>
    </>
  )
}
