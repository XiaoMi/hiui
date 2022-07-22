import React from 'react'
import Timeline from '../src'

/**
 * @title 左右结构样式
 * @desc 不同样式的时间轴，突出时间走向
 */
export const Placement = () => {
  return (
    <>
      <h1>Placement</h1>
      <div className="timeline-placement__wrap">
        <Timeline
          placement="horizontal"
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
        <br />
        <br />
        <Timeline
          placement="horizontal"
          itemPlacement="center"
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
