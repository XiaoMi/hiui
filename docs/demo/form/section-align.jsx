import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Grid from '../../../components/grid'
import Radio from '../../../components/radio'
import Button from '../../../components/button'
const prefix = 'form-align'
const code = `import React from 'react'
import { Form, Grid, Radio, Button, Input } from '@hi-ui/hiui'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state = {
      alignList: [
        {
          id: 'left',
          content: '左对齐'
        },
        {
          id: 'right',
          content: '右对齐'
        },
        {
          id: 'top',
          content: '顶对齐'
        }
      ],
      position: 'left'
    }
  }
  render (){
    const { position, alignCheckedIndex, columnCheckedIndex } = this.state
    const FormItem = Form.Item
    const Row = Grid.Row
    const Col = Grid.Col
    return (
      <div>
        <Row gutter>
          <Col span={12}>
            <Radio.Group
              type='button'
              data={this.state.alignList}
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
            <Form labelWidth='80' labelPlacement={this.state.position}>
              <FormItem label='姓名'>
                <Input placeholder='username' />
              </FormItem>
              <FormItem label='手机号码'>
                <Input placeholder='phone' />
              </FormItem>
              <FormItem>
                <Button type='primary'>提交</Button>
              </FormItem>
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
