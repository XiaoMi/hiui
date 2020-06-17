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
  constructor(props){
    super(props)
    this.state = {
      formData : {
        name: '',
        phone: '',
        remark: ''
      }
    }
    this.form = React.createRef()
  }
  render (){
    const FormItem = Form.Item
    const {formData} = this.state
    return (
      <>
      <Form labelWidth='80' labelPlacement='left' 
        formRef={this.form}
        initialValues={formData}>
        <FormItem label='姓名' required field="name" rules={{
          trigger:'onBlur',
          type:'number',
          }}>
          <Input placeholder='请输入' />
        </FormItem>
        <FormItem label='手机号码' field="phone" rules={{
          trigger:'onChange',
          type:'number',
          validator: (rule, value,callback) => {
            console.log(rule, value)
            callback("dsdsds")
          },
          }}>
          <Input placeholder='请输入' />
        </FormItem>
        <FormItem label='备注' field="remark">
          <Input
            type="textarea"
            placeholder="请输入"
          />
        </FormItem>
        <FormItem>
          <Button type='primary'>提交</Button>
        </FormItem>
      </Form>
      <Button type='primary' onClick={()=>{
        console.log(this.form.current.validate())
      }}>提交</Button>
      <Button type='primary' onClick={()=>{
        console.log(this.form.current.resetValidates())
      }}>重置</Button>

      </>
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
