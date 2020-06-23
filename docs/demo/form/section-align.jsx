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
    const FormSubmit = Form.Submit
    const FormReset = Form.Reset

    const {formData} = this.state
    return (
      <>
      <Form labelWidth='80' labelPlacement='left' 
        formRef={this.form}
        initialValues={formData}>
        <FormItem label='姓名' field="name" rules={{
          trigger:'onBlur',
          type:'string',
          required:true,
          }}>
          <Input placeholder='请输入' />
        </FormItem>
        <FormItem label='手机号码' field="phone" rules={{
          trigger:'onChange',
          type:'number',
          validator: (rule, value,callback) => {
            const telReg = /^[1][3|4|5|6|7|8|9][0-9]{9}$/
            if(!value){
              callback("请输入手机号")
            } else if (!telReg.test(value)){
              callback("请输入正确的手机号")
            } else {
              callback()
              console.log(rule, value)
            }
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
          <FormSubmit type='primary' onClick={(...args)=>{console.log(...args)}}>提交</FormSubmit>
          <FormReset type='line' onClick={(...args)=>{console.log(...args)}}>重置</FormReset>
        </FormItem>
      </Form>

      <Button type='primary' onClick={()=>{this.form.current.validate((values,errors)=>{
        console.log('values,errors',values,errors)
      })
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
