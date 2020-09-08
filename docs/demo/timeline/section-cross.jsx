import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Timeline from '../../../components/timeline'
import Icon from '../../../components/icon'
const prefix = 'timeline-cross'
const desc = '不同样式的时间轴，突出时间走向'
const code = `import React from 'react'
import Icon from '../../../components/icon'
import Timeline from '@hi-ui/hiui/es/timeline'\n
class Demo extends React.Component {
  render () {
    const data = [{
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
        <Timeline data={data} type='cross'/>
      </div>
    )
  }
}`

const DemoCross = () => (
  <DocViewer
    code={code}
    scope={{ Timeline, Icon }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoCross
