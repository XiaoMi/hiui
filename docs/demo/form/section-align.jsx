import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Checkbox from '../../../components/checkbox'
import Button from '../../../components/button'
const prefix = 'form-align'
const rightOptions = ['左对齐', '右对齐', '顶对齐']
const desc = ['左对齐：表单项较少，对应标题字数易对齐工整']
const code = [
  {
    code: `import React from 'react'
    import { Form, Grid, Radio, Button, Input } from '@hi-ui/hiui'\n
    class Demo extends React.Component {  
      constructor(props){
        super(props)
        this.state = {
          formData : {
            phone: '',
            password:'',
            remember:true,
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
          <Form 
            labelWidth='80' 
            labelPlacement='left' 
            initialValues={formData}
            onValuesChange ={(changedValues,allValues) => {
              console.log("changedValues:",changedValues ,"allValues:",allValues)
            }}
          >
            <FormItem label='账号' field="phone" rules={{
              trigger:'onChange',
              type:'number',
              required:true,
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
              <Input placeholder='请输入手机号' />
            </FormItem>
            <FormItem label='密码' field="password" rules={{
              trigger:'onBlur',
              type:'string',
              required:true,
              }}>
              <Input type='password' placeholder='请输入' />
            </FormItem>
            <FormItem field="remember" valuePropName="checked">
              <Checkbox onChange={()=>{
                console.log('checkbox remeber me')
              }}> 记住我 </Checkbox>
            </FormItem>
            <FormItem>
             <FormSubmit type='primary' 
              onClick={(values,errors)=>{
                console.log('Get form value:',values,errors)}
              }
              >提交</FormSubmit>
              <FormReset type='line' 
                onClick={()=>{console.log('reset form')}}
              >重置</FormReset>
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
      constructor(props){
        super(props)
        this.state = {
          formData : {
            email: '',
            password:'',
            remember:true,
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
          <Form labelWidth='80' labelPlacement='right' 
            initialValues={formData}>
            <FormItem label='邮箱' field="email" rules={
              [
                {
                  type: "string", 
                  required: true, 
                  pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                }
              ]
            }>
              <Input placeholder='请输入' />
            </FormItem>
            <FormItem label='密码' field="password" rules={
              [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 5, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
              ]
            }>
              <Input placeholder='请输入' />
            </FormItem>
            <FormItem field="remember" valuePropName="checked">
              <Checkbox onChange={()=>{
                console.log('checkbox remeber me')
              }}> 记住我 </Checkbox>
            </FormItem>
            <FormItem>
             <FormSubmit type='primary' 
              onClick={(values,errors)=>{
                console.log('Get form value:',values,errors)}
              }
              >提交</FormSubmit>
              <FormReset type='line' 
                onClick={()=>{console.log('reset form')}}
              >重置</FormReset>
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
      constructor(props){
        super(props)
        this.state = {
          formData : {
            phone: '',
            password:'',
            remember:true,
          },
          rules:{
            phone:{
              trigger:'onChange',
              type:'number',
              required:true,
              validator: (rule,value,callback) => {
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
              },
              password:[
                { required: true, message: '请输入密码', trigger: 'onBlur' },
                { min: 5, max: 16, message: '长度在 6 到 16 个字符', trigger: 'onBlur' }
              ]
          }
        }
        this.form = React.createRef()
      }
      render (){
        const FormItem = Form.Item
        const FormSubmit = Form.Submit
        const FormReset = Form.Reset
        const {formData,rules} = this.state
        return (
          <Form labelWidth='80' labelPlacement='top' 
            initialValues={formData}
            rules={rules}
            >
            <FormItem label='账号' field="phone">
              <Input placeholder='请输入手机号' />
            </FormItem>
            <FormItem label='密码' field="password">
              <Input placeholder='请输入' />
            </FormItem>
            <FormItem field="remember" valuePropName="checked" style={{mariginTop:'-30px'}}>
              <Checkbox onChange={()=>{
                console.log('checkbox remeber me')
              }}> 记住我 </Checkbox>
            </FormItem>
            <FormItem>
             <FormSubmit type='primary' 
              onClick={(values,errors)=>{
                console.log('Get form value:',values,errors)}
              }
              >提交</FormSubmit>
              <FormReset type='line' 
                onClick={()=>{console.log('reset form')}}
              >重置</FormReset>
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
    scope={{ Form, Input, Button, Checkbox }}
    prefix={prefix}
    desc={desc}
    rightOptions={rightOptions}
  />
)
export default DemoAlign
