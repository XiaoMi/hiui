import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Timeline from '../../../components/timeline'
import Progress from '../../../components/progress'
import Grid from '../../../components/grid'
import Form from '../../../components/form'
import Input from '../../../components/input'
import Radio from '../../../components/radio'
import Button from '../../../components/button'
import Icon from '../../../components/icon'
const prefix = 'timeline-basic'
const desc = '以时间为第一维度，展示该时间点的事务、日程、任务或记录'
const code = `import React from 'react'
import { Form, Grid, Radio, Button, Input, Timeline  } from '@hi-ui/hiui'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state = {
      typeList: [
        {
          id: 'day',
          content: '按日'
        },
        {
          id: 'month',
          content: '按月'
        },
        {
          id: 'year',
          content: '按年'
        }
      ],
      position: 'day'
    }
  }
  render () {
    const { position } = this.state
    const FormItem = Form.Item
    const Row = Grid.Row
    const Col = Grid.Col
    let  data = []
    if(position === 'day'){
      data = [{
        groupTitle: '上午',
        children: [{
          title: <div style={{display:'flex'}}><div style={{marginRight:8}}>管理层例会</div><Progress percent={10} /></div>,
          content: '毕加索会议室 B2层 可提前预定预…',
          timestamp: '10:00',
        }, {
          title: '社招面试-设计师',
          content: '总参',
          timestamp: '10:00',
        }]
      }, {
        groupTitle: '下午',
        children: [{
          title: '管理层例会',
          content: '毕加索会议室 B2层 可提前预定预…',
          timestamp: '12:00',
        }, {
          title: '社招面试-设计师',
          content: '总参',
          timestamp: '11:00',
        }]
      }]
    }else if(position === 'month'){
      data = [{
          title: '管理层例会',
          content: '毕加索会议室 B2层 可提前预定预…',
          timestamp: '10:00',
          extraTime: '02-23'
        }, {
          title: '社招面试-设计师',
          content: '总参',
          timestamp: '10:00',
          extraTime: '02-27'
        }, {
          title: '管理层例会',
          content: '毕加索会议室 B2层 可提前预定预…',
          timestamp: '12:00',
          extraTime: '03-02'
        }, {
          title: '社招面试-设计师',
          content: '总参',
          timestamp: '11:00',
          extraTime: '03-10'
        }
      ]
      }else{
        data = [{
          groupTitle: '2019',
          children: [{
            title: '管理层例会',
          content: '毕加索会议室 B2层 可提前预定预…',
            extraTime: '02-23'
          }, {
            title: '社招面试-设计师',
            content: '总参',
            extraTime: '02-27'
          }]
        }, {
          groupTitle: '2018',
          children: [{
            title: '管理层例会',
            content: '毕加索会议室 B2层 可提前预定预…',
            extraTime: '03-02'
          }, {
            title: '社招面试-设计师',
            content: '总参',
            extraTime: '03-10'
          }]
        }]

    }

    return (
      <div>
      <div>
      <Row gutter>
        <Col span={12}>
          <Radio.Group
            type='button'
            data={this.state.typeList}
            value={this.state.position}
            onChange={(data) => {
              this.setState({
                position: data
              })
            }}
          />
        </Col>
      </Row>
      <Row gutter>
        <Col span={12}>
        <Timeline data={data}/>
        </Col>
      </Row>
    </div>
      </div>
    )
  }
}`

const DemoBasic = () => (
  <DocViewer
    code={code}
    scope={{ Timeline, Form, Radio, Grid, Input, Button, Icon, Progress }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoBasic
