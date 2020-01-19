import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Button from '../../../components/button'
import Grid from '../../../components/grid'
const prefix = 'form-two-col'
const desc = '当表单项数量较多、界面空间充裕且label名称较长时使用，两列间距可灵活调整。'
const code = `import React from 'react'
import { Form, Input, Grid } from '@hi-ui/hiui'
class Demo extends React.Component {
  render (){
    const Row = Grid.Row
    const Col = Grid.Col
    const FormItem = Form.Item
    return (
      <div style={{width: 500}}>
        <Form labelPlacement='top'>
          <Row>
            <Col span={12}>
              <FormItem label='姓名' labelWidth='70'>
                <Input placeholder={'请输入'} style={{width: '200'}} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='密码' labelWidth='70'>
                <Input type='password' placeholder={'请输入'} style={{width: '200'}} />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label='手机号' labelWidth='70'>
                <Input placeholder={'请输入'} style={{width: '200'}} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='邮箱' labelWidth='70'>
                <Input type='password' placeholder={'请输入'} style={{width: '200'}} />
              </FormItem>
            </Col>
          </Row>
          <FormItem>
            <Button type='primary' onClick={()=>{}}>提交</Button>
            <Button type='line' onClick={()=>{}}>重置</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}`

const DemoRow = () => (
  <DocViewer
    code={code}
    scope={{ Form, Button, Input, Grid }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoRow
