import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Button from '../../../components/button'
import Grid from '../../../components/grid'
const prefix = 'form-two-col'
const rightOptions = ['上下结构', '左右结构']
const desc = [
  '上下结构：表单项对应的标题长度较长，表单项较多',
  '左右结构：屏幕分辨率较大，表单项较多且对应标题长度短且易对齐'
]
const code = [
  {
    code: `import React from 'react'
import { Form, Input, Grid } from '@hi-ui/hiui'
class Demo extends React.Component {
  render (){
    const Row = Grid.Row
    const Col = Grid.Col
    const FormItem = Form.Item
    return (
      <div style={{width: 500}}>
        <Form labelWidth='70' labelPlacement='top'>
          <Row>
            <Col span={12}>
              <FormItem label='姓名' >
                <Input placeholder={'请输入'} style={{width: '200'}} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='密码' >
                <Input type='password' placeholder={'请输入'} style={{width: '200'}} />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label='手机号' >
                <Input placeholder={'请输入'} style={{width: '200'}} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='邮箱' >
                <Input type='password' placeholder={'请输入'} style={{width: '200'}} />
              </FormItem>
            </Col>
          </Row>
          <FormItem >
            <Button type='primary' onClick={()=>{}}>提交</Button>
            <Button type='line' onClick={()=>{}}>重置</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}`,
    opt: ['上下结构']
  },
  {
    code: `import React from 'react'
import { Form, Input, Grid } from '@hi-ui/hiui'
class Demo extends React.Component {
  render (){
    const Row = Grid.Row
    const Col = Grid.Col
    const FormItem = Form.Item
    return (
      <div style={{width: 500}}>
        <Form labelWidth='70' labelPlacement='right'>
          <Row>
            <Col span={12}>
              <FormItem label='姓名' >
                <Input placeholder={'请输入'} style={{width: '200'}} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='密码' >
                <Input type='password' placeholder={'请输入'} style={{width: '200'}} />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label='手机号' >
                <Input placeholder={'请输入'} style={{width: '200'}} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='邮箱' >
                <Input type='password' placeholder={'请输入'} style={{width: '200'}} />
              </FormItem>
            </Col>
          </Row>
          <FormItem >
            <Button type='primary' onClick={()=>{}}>提交</Button>
            <Button type='line' onClick={()=>{}}>重置</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}`,
    opt: ['左右结构']
  }
]

const DemoRow = () => (
  <DocViewer
    code={code}
    scope={{ Form, Button, Input, Grid }}
    prefix={prefix}
    desc={desc}
    rightOptions={rightOptions}
  />
)
export default DemoRow
