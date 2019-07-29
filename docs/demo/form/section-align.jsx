import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form'
import Input from '../../../components/input'
import Grid from '../../../components/grid'
import Radio from '../../../components/radio'
import Button from '../../../components/button'
const prefix = 'form-align'
const code = `
import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Radio from '@hi-ui/hiui/es/radio'
import Button from '@hi-ui/hiui/es/form/button'
import Input from '@hi-ui/hiui/es/input'
import Form from '@hi-ui/hiui/es/form'\n
class Demo extends React.Component {
  constructor() {
    super()

    this.state = {
      alignCheckedIndex: 0,
      alignList: [
        {
          id: 'left',
          name: '左对齐'
        },
        {
          id: 'right',
          name: '右对齐'
        },
        {
          id: 'top',
          name: '顶对齐'
        },
      ],
      columnCheckedIndex: 0,
      columnList: [
        {
          id: '12',
          name: 'S'
        },
        {
          id: '16',
          name: 'M'
        },
        {
          id: '20',
          name: 'L'
        },
      ],
      position: 'left',
      column: '12'
    }
  }

  render(){
    const {position, alignCheckedIndex, columnCheckedIndex} = this.state
    const Row = Grid.Row
    const Col = Grid.Col
    return (
      <div>
        <Row gutter={true}>
          <Col span={12}>

            <Radio
              list={this.state.alignList}
              mode='button'
              checked={alignCheckedIndex}
              onChange={(data, index) => {
                this.setState({
                  position: data,
                  alignCheckedIndex: index
                })
              }}
            />

          </Col>
          <Col span={12}>

            <Radio
              list={this.state.columnList}
              mode='button'
              checked={columnCheckedIndex}
              onChange={(data, index) => {
                this.setState({
                  column: data,
                  columnCheckedIndex: index
                })
              }}
            />

          </Col>
        </Row>
        <Row gutter={true}>
          <Col span={this.state.column}>

            <Form labelWidth='80' labelPosition={this.state.position}>
              <Form.Item label={'姓名'}>
                <Input placeholder={'username'} />
              </Form.Item>

              <Form.Item label={'手机号码'}  >
                <Input placeholder={'phone'} />
              </Form.Item>

              <Form.Item>
                <Button type={'primary'}>提交</Button>
              </Form.Item>
            </Form>

          </Col>
        </Row>
      </div>
    )
  }
}`
const DemoAlign = () => (
  <DocViewer
    code={code}
    scope={{ Form, Radio, Grid, Input, Button }}
    prefix={prefix}
  />
)
export default DemoAlign
