import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Timeline from '../../../components/timeline'
import Icon from '../../../components/icon'
const prefix = 'timeline-collapse'
const desc = '在同一时间维度上，同时展式两个层级的信息'
const code = `import React from 'react'
import Icon from '@hi-ui/hiui/es/icon'
import Timeline from '@hi-ui/hiui/es/timeline'\n
class Demo extends React.Component {
  render () {
    const data = [{
          title: 'Title - 1',
          content: 'Here are some descriptions',
          timestamp: '10:00',
          extraTime: '02-23'
        }, {
          title: 'Title 2',
          content: 'Here are some descriptions',
          timestamp: '10:00',
          extraTime: '02-23'
        },{
          title: 'Title 3',
          content: 'Here are some descriptions',
          timestamp: '10:00',
          extraTime: '02-23',
          children: [{
            title: 'Sub 1',
            content: 'Here are some descriptions'
          }, {
            title: 'Sub 2',
            content: 'Here are some descriptions'
          }]
        }, {
          icon: <Icon name='collection' style={{fontSize: 16, color: 'red'}} />,
          title: 'Title 2-2',
          content: 'Here are some descriptions',
          timestamp: '10:00',
          extraTime: '02-23'
        }, {
          title: 'Title 4',
          content: 'Here are some descriptions',
          timestamp: '10:00',
          extraTime: '02-23'
        }]
    return (
      <div>
        <div style={{display: 'flex'}}>
          <Timeline data={data} />
        </div>
      </div>
    )
  }
}`

const DemoCollapse = () => (
  <DocViewer
    code={code}
    scope={{ Timeline, Icon }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoCollapse
