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
        groupTitle: '2月',
        children: [{
          title: 'Title - 1',
          content: 'Here are some descriptions',
          timestamp: '10:00',
          extraTime: '02-23'
        }, {
          title: 'Title 2',
          content: 'Here are some descriptions',
          timestamp: '10:00',
          extraTime: '02-27'
        }]
      }, {
        groupTitle: '3月',
        children: [{
          title: 'Title 3',
          content: 'Here are some descriptions',
          timestamp: '12:00',
          extraTime: '03-02'
        }, {
          title: 'Title 4',
          content: 'Here are some descriptions',
          timestamp: '11:00',
          extraTime: '03-10'
        }]
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
