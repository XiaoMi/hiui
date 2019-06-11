import React from 'react'
import DocViewer from '../../../../libs/doc-viewer'
import Timeline from '../../../../components/timeline'
import Icon from '../../../../components/icon'
const prefix = 'timeline-cross'

const code = `import React from 'react'
import Icon from '../../../../components/icon'
import Timeline from '@hiui/hiui/es/timeline'\n
class Demo extends React.Component {
  render () {
    const datas = [{
        groupTitle: '上午',
        children: [{
          // dot: <Icon name='circle' style={{fontSize: 16}} />,
          title: 'Title - 1',
          description: 'Here are some descriptions',
          timestamp: '9:00',
          extraTime: '02-25'
        }, {
          dot: 'circle',
          title: 'Title 1-2',
          description: 'Here are some descriptions',
          timestamp: '10:00'
        }]
      }, {
        groupTitle: '下午',
        children: [{
          dot: 'circle',
          title: 'Title 2-1',
          description: 'Here are some descriptions',
          timestamp: '12:00',
          folding: true,
          children: [{
            title: 'Sub 1',
            description: 'Here are some descriptions'
          }, {
            title: 'Sub 2',
            description: 'Here are some descriptions'
          }]
        }, {
          dot: <Icon name='collection' style={{fontSize: 16, color: 'red'}} />,
          title: 'Title 2-2',
          description: 'Here are some descriptions',
          timestamp: '12:00'
        }]
      }, {
        groupTitle: 'Group 3',
        children: [{
          dot: 'circle',
          title: 'Title 3-1',
          description: 'Here are some descriptions',
          timestamp: '11:00',
          extraTime: '11-25'
        }, {
          dot: 'circle',
          title: 'Title 3-2',
          description: 'Here are some descriptions',
          timestamp: '12:00'
        }]
      }]
    return (
      <div>
        <Timeline list={datas} layout='cross'/>
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
