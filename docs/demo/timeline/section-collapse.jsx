import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Timeline from '../../../components/timeline'
import Icon from '../../../components/icon'
const prefix = 'timeline-collapse'

const code = `import React from 'react'
import Icon from '@hiui/hiui/es/icon'
import Timeline from '@hiui/hiui/es/timeline'\n
class Demo extends React.Component {
  render () {
    const datas = [{
          title: 'Title - 1',
          description: 'Here are some descriptions',
          timestamp: '2019.02.24 12:00:00'
        }, {
          title: 'Title 2',
          description: 'Here are some descriptions',
          timestamp: '2019.02.24 14:24:00'
        },{
          title: 'Title 3',
          description: 'Here are some descriptions',
          timestamp: '2019.02.24 15:00:00',
          children: [{
            title: 'Sub 1',
            description: 'Here are some descriptions'
          }, {
            title: 'Sub 2',
            description: 'Here are some descriptions'
          }]
        }, {
          icon: <Icon name='collection' style={{fontSize: 16, color: 'red'}} />,
          title: 'Title 2-2',
          description: 'Here are some descriptions',
          timestamp: '12:00'
        }, {
          title: 'Title 4',
          description: 'Here are some descriptions',
          timestamp: '2019.02.24 19:55:00'
        }]
    return (
      <div>
        <div style={{display: 'flex'}}>
          <Timeline list={datas} layout='right'/>
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
    desc={'当信息流包含两级信息时使用，当为左右结构式，暂不支持可折叠'}
  />
)
export default DemoCollapse
