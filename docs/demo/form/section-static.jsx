/* eslint-disable */
import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form, { LegacyForm } from '../../../components/form'
import Input from '../../../components/input'
import Checkbox from '../../../components/checkbox'
import Button from '../../../components/button'
import Grid from '../../../components/grid'
import Radio from '../../../components/radio'
import Select from '../../../components/select'
const prefix = 'form-static'
const rightOptions = ['静默获取表单值', '静默校验表单']
const desc = ['静默获取表单值：不触发校验', '静默校验表单: 触发校验, 但是页面中不显示错误信息']
const code = [
  {
    code: `import React from 'react'
  import { Form, Grid, Radio, Button, Input } from '@hi-ui/hiui'\n
    class Demo extends React.Component {  
      constructor(props){
        super(props)
        this.form = React.createRef()
      }
      componentDidMount() {
        this.form.current && this.form.current.setFieldsValue({ phone: '不合法手机号', name: '' })
      }
      render (){
        const FormItem = Form.Item
        const FormSubmit = Form.Submit
        const FormReset = Form.Reset
        return (
          <Form labelPlacement='left' labelWidth={80} ref={this.form}>
              <FormItem label='手机号' field="phone"  rules={{
                trigger:'onChange',
                type:'number',
                validator: (rule,value,callback) => {
                  const telReg = /^[1][3|4|5|6|7|8|9][0-9]{9}$/
                  if(!value){
                      callback("请输入手机号")
                  } else if (!telReg.test(value)){
                      callback("请输入正确的手机号")
                  } else {
                      callback()
                  }
                },
              }}>
                <Input placeholder='请输入手机号' style={{ width: 200 }} />
              </FormItem>
            <FormItem required={true} label="姓名" field="name">
              <Input placeholder="请输入" style={{ width: 200 }}/>
            </FormItem>
            <FormItem label="" >
            <Button type='primary' 
              onClick={()=>{
                const values = this.form.current.getFieldsValue()
                console.log('获取表单值, 但是不触发校验方法',values)
              }}
              >获取表单值</Button>
            </FormItem>
          </Form>
        )
      }
    }`,
    opt: ['静默获取表单值']
  },
  {
    code: `import React from 'react'
  import { Form, Grid, Radio, Button, Input } from '@hi-ui/hiui'\n
    class Demo extends React.Component {  
      constructor(props){
        super(props)
        this.form = React.createRef()
      }
      componentDidMount() {
        this.form.current && this.form.current.setFieldsValue({ phone: '不合法手机号', name: '' })
      }
      render (){
        const FormItem = Form.Item
        const FormSubmit = Form.Submit
        const FormReset = Form.Reset
        return (
          <Form labelPlacement='left' labelWidth={80} ref={this.form}>
              <FormItem label='手机号' field="phone"  rules={{
                trigger:'onChange',
                type:'number',
                validator: (rule,value,callback) => {
                  const telReg = /^[1][3|4|5|6|7|8|9][0-9]{9}$/
                  if(!value){
                      callback("请输入手机号")
                  } else if (!telReg.test(value)){
                      callback("请输入正确的手机号")
                  } else {
                      callback()
                  }
                },
              }}>
                <Input placeholder='请输入手机号' style={{ width: 200 }} />
              </FormItem>
            <FormItem required={true} label="姓名" field="name">
              <Input placeholder="请输入" style={{ width: 200 }}/>
            </FormItem>
            <FormItem label="" >
            <Button type='primary' 
              onClick={()=>{
                const error = this.form.current.getFieldsError()
                console.log('获取表单错误信息',error)
              }}
              >获取表单错误信息</Button>
            </FormItem>
          </Form>
        )
      }
    }`,
    opt: ['静默校验表单']
  }
]
const DemoAlign = () => (
  <DocViewer
    code={code}
    scope={{ Form, Input, Button, Checkbox, LegacyForm, Grid, Radio, Select }}
    prefix={prefix}
    desc={desc}
    rightOptions={rightOptions}
  />
)
export default DemoAlign
