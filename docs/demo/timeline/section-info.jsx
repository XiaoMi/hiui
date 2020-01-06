import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Timeline from '../../../components/timeline'
const prefix = 'timeline-info'
const desc = '在一段时间范围里，信息流向增长，数量庞大，必要时可收起部分'
const code = `import React from 'react'
import Timeline from '@hi-ui/hiui/es/timeline'\n
class Demo extends React.Component {
  render () {
    const datas = [{
          title: '信息部全员财务培训需求收集',
          content: '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
          timestamp: '10:00',
          extraTime: '02-23'
        }, {
          title: '信息部全员财务培训需求收集',
          content: '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
          timestamp: '10:00',
          extraTime: '02-27'
        }, {
          title: '信息部全员财务培训需求收集',
          content: '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
          timestamp: '12:00',
          extraTime: '03-02'
        }, {
          title: '信息部全员财务培训需求收集',
          content: '为使信息部同事更好的研发、运维和服务财务部的需求和工作，财务部计划给信息部同事提供财务相关的培训',
          timestamp: '11:00',
          extraTime: '03-10'
      }]

    return (
      <div>
        <div style={{display: 'flex'}}>
          <Timeline list={datas}/>
        </div>
      </div>
    )
  }
}`

const DemoInfo = () => (
  <DocViewer
    code={code}
    scope={{ Timeline }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoInfo
