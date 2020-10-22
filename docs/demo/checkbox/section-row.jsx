import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Checkbox from '../../../components/checkbox'
import Grid from '../../../components/grid'
const prefix = 'section-row'
const desc = 'Checkbox 与 Grid 组件一起使用，可以实现灵活的布局。'
const code = `import React from 'react'
import Checkbox from '@hi-ui/hiui/es/checkbox'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      list: [{
        content: '手机',
        id: 'Phone'
      },{
        content: '电脑',
        id: 'Computer'
      },{
        content: '智能',
        id: 'Intelli'
      },{
        content: '出行',
        id: 'Transfer',
        disabled: true
      }],
      value: ['Phone']
    }
  }
  render() {
    const Row = Grid.Row
    const Col = Grid.Col
    return (
      <div>
        <Row>
          <Col span={8}>
            <Checkbox onChange={(e)=>{
              console.log('checked',e.target.checked)
            }}>
              手机
            </Checkbox>
          </Col>
          <Col span={8}>
            <Checkbox onChange={(e)=>{
              console.log('checked',e.target.checked)
            }}>
            电脑
            </Checkbox>
          </Col>
          <Col span={8}>
            <Checkbox onChange={(e)=>{
              console.log('checked',e.target.checked)
            }}>
              智能
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
              <Checkbox onChange={(e)=>{
                console.log('checked',e.target.checked)
              }}>
                出行
              </Checkbox>
          </Col>
          <Col span={8}>
              <Checkbox onChange={(e)=>{
                console.log('checked',e.target.checked)
              }}>
                生态
              </Checkbox>
          </Col>
        </Row>
      </div>
    )
  }
}`

const DemoBasic = () => (
  <DocViewer
    code={code}
    scope={{ Checkbox, Grid }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoBasic
