import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import FormItem from '../../../components/form/Item'
import Input from '../../../components/input'
import Grid from '../../../components/grid'
import Radio from '../../../components/radio'
import Button from '../../../components/button'
const prefix = 'form-align'
const code = `
import React from 'react'
import Grid from '@hiui/hiui/es/grid'
import Radio from '@hiui/hiui/es/radio'
import FormItem from '@hiui/hiui/es/form/item'
import Button from '@hiui/hiui/es/form/button'
import Input from '@hiui/hiui/es/input'
import Form from '@hiui/hiui/es/form/index'\n
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
        },
      ],
      position: 'left'
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
        <Row gutter={true}>
          <Col span={12}>
            <Form labelWidth='80' labelPosition={this.state.position}>
              <FormItem label={'姓名'}>
                <Input placeholder={'username'} />
              </FormItem>

              <FormItem label={'手机号码'}  >
                <Input placeholder={'phone'} />
              </FormItem>

              <FormItem>
                <Button type={'primary'}>提交</Button>
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
    scope={{ Form, FormItem, Radio, Grid, Input, Button }}
    prefix={prefix}
  />
)
export default DemoAlign
