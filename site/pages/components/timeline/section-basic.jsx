import React from 'react'
import DocViewer from '../../../../libs/doc-viewer'
import Timeline from '../../../../components/timeline'
const prefix = 'timeline-basic'

const code = `import React from 'react'
import Timeline from '@hiui/hiui/es/timeline'\n
class Demo extends React.Component {
  render () {
    const datas = [{
        groupTitle: '2月',
        children: [{
          title: 'Title - 1',
          description: 'Here are some descriptions',
          timestamp: '10:00',
          extraTime: '02-23'
        }, {
          dot: 'circle',
          title: 'Title 2',
          description: 'Here are some descriptions',
          timestamp: '10:00',
          extraTime: '02-27'
        }]
      }, {
        groupTitle: '3月',
        children: [{
          dot: 'circle',
          title: 'Title 3',
          description: 'Here are some descriptions',
          timestamp: '12:00',
          extraTime: '03-02'
        }, {
          dot: 'circle',
          title: 'Title 4',
          description: 'Here are some descriptions',
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

const DemoBasic = () => (
  <DocViewer code={code} scope={{ Timeline }} prefix={prefix} desc={'基础用法'} />
)
export default DemoBasic
