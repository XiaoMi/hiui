import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Timeline from '../../../components/timeline'
import Icon from '../../../components/icon'
const prefix = 'timeline-icon'
const desc = '可运用图标加强对时间节点上的信息状态表示'
const code = `import React from 'react'
import Icon from '@hi-ui/hiui/es/icon'
import Timeline from '@hi-ui/hiui/es/timeline'\n
class Demo extends React.Component {
  render () {
    const data = [{
          title: 'Title - 1',
          content: 'Here are some descriptions',
          timestamp: '2019.02.24 12:00:00'
        }, {
          title: 'Title 2',
          content: 'Here are some descriptions',
          timestamp: '2019.02.24 14:24:00'
        },{
          title: 'Title 3',
          content: 'Here are some descriptions',
          timestamp: '2019.02.24 15:00:00',
        },{
          icon: <Icon name='collection' style={{fontSize: 16, color: 'red'}} />,
          title: 'Title 2-2',
          content: 'Here are some descriptions',
          timestamp: '12:00'
        }, {
          title: 'Title 4',
          content: 'Here are some descriptions',
          timestamp: '2019.02.24 19:55:00'
        }]
    return (
      <div>
        <div style={{display: 'flex'}}>
          <Timeline data={data} type='right'/>
        </div>
      </div>
    )
  }
}`

const DemoIcon = () => (
  <DocViewer
    code={code}
    scope={{ Timeline, Icon }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoIcon
