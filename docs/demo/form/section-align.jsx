import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'

import Button from '../../../components/button'
const prefix = 'form-align'
const rightOptions = ['左对齐', '右对齐', '顶对齐']
const desc = [
  '左对齐：表单项较少，对应标题字数易对齐工整',
  '右对齐：表单项较多，对填写效率有要求'
]
const code = [
  {
    code: `import React from 'react'
import { Form, Grid, Radio, Button, Input } from '@hi-ui/hiui'\n
class Demo extends React.Component {
  render (){
    const FormItem = Form.Item
    return (
      <Form labelWidth='80' labelPlacement='left'>
        <FormItem label='姓名'>
          <Input placeholder='请输入' />
        </FormItem>
        <FormItem label='手机号码'>
          <Input placeholder='请输入' />
        </FormItem>
        <FormItem label='备注'>
          <Input
            type="textarea"
            placeholder="请输入"
          />
        </FormItem>
        <FormItem>
          <Button type='primary'>提交</Button>
        </FormItem>
      </Form>
    )
  }
}`,
    opt: ['左对齐']
  },
  {
    code: `import React from 'react'
import { Form, Grid, Radio, Button, Input } from '@hi-ui/hiui'\n
class Demo extends React.Component {
  render (){
    const FormItem = Form.Item
    return (
      <Form labelWidth='80' labelPlacement='right'>
        <FormItem label='姓名'>
          <Input placeholder='请输入' />
        </FormItem>
        <FormItem label='手机号码'>
          <Input placeholder='请输入' />
        </FormItem>
        <FormItem label='备注'>
          <Input
            type="textarea"
            placeholder="请输入"
          />
        </FormItem>
        <FormItem>
          <Button type='primary'>提交</Button>
        </FormItem>
      </Form>
    )
  }
}`,
    opt: ['右对齐']
  },
  {
    code: `import React from 'react'
import { Form, Grid, Radio, Button, Input } from '@hi-ui/hiui'\n
class Demo extends React.Component {
  render (){
    const FormItem = Form.Item
    return (
      <Form labelWidth='80' labelPlacement='top'>
        <FormItem label='姓名'>
          <Input placeholder='请输入' />
        </FormItem>
        <FormItem label='手机号码'>
          <Input placeholder='请输入' />
        </FormItem>
        <FormItem label='备注'>
          <Input
            type="textarea"
            placeholder="请输入"
          />
        </FormItem>
        <FormItem>
          <Button type='primary'>提交</Button>
        </FormItem>
      </Form>
    )
  }
}`,
    opt: ['顶对齐']
  }
]
const DemoAlign = () => (
  <DocViewer
    code={code}
    scope={{ Form, Input, Button }}
    prefix={prefix}
    desc={desc}
    rightOptions={rightOptions}
  />
)
export default DemoAlign
