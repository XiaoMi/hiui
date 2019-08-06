import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Timeline from '../../../components/timeline'
import Icon from '../../../components/icon'
const prefix = 'timeline-cross'

const code = `import React from 'react'
import Icon from '../../../components/icon'
import Timeline from '@hi-ui/hiui/es/timeline'\n
class Demo extends React.Component {
  render () {
    const data = [{
        groupTitle: '上午',
        children: [{
          title: 'Title - 1',
          content: 'Here are some descriptions',
          timestamp: '9:00',
          extraTime: '02-25'
        }, {
          title: 'Title 1-2',
          content: 'Here are some descriptions',
          timestamp: '10:00'
        }]
      }, {
        groupTitle: '下午',
        children: [{
          title: 'Title 2-1',
          content: 'Here are some descriptions',
          timestamp: '12:00',
          folding: true,
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
          timestamp: '12:00'
        }]
      }, {
        groupTitle: 'Group 3',
        children: [{
          title: 'Title 3-1',
          content: 'Here are some descriptions',
          timestamp: '11:00',
          extraTime: '11-25'
        }, {
          title: 'Title 3-2',
          content: 'Here are some descriptions',
          timestamp: '12:00'
        }]
      }]
    return (
      <div>
        <Timeline list={data} layout='cross'/>
      </div>
    )
  }
}`

const DemoCross = () => (
  <DocViewer
    code={code}
    scope={{ Timeline, Icon }}
    prefix={prefix}
    desc={'不同样式的时间轴，突出时间走向'}
  />
)
export default DemoCross
