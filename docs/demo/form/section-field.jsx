import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Checkbox from '../../../components/checkbox'
import Button from '../../../components/button'
const prefix = 'form-field'
const rightOptions = '字段嵌套输出'
const desc = ['根据field设置Form输出数据的内容格式']
const code = `import React from 'react'
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
            <FormItem 
              label='账号' 
              field={['login',"phone"]} 
              rules={{
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
            <FormItem 
              label='密码' 
              field={['login',"password"]} 
              rules={{
              trigger:'onBlur',
              type:'string',
              required:true,
              }}>
              <Input type='password' placeholder='请输入' />
            </FormItem>
            <FormItem 
              field="remember" 
              valuePropName="checked">
              <Checkbox onChange={()=>{
                console.log('checkbox remeber me')
              }}> 记住我 </Checkbox>
            </FormItem>
            <FormItem>
             <FormSubmit 
              type='primary'

              onClick={(values,errors)=>{
                console.log('Get form value:',values,errors)}
              }
              >提交</FormSubmit>
              <FormReset 
              type='line' 
                onClick={()=>{console.log('reset form')}}
              >重置</FormReset>
            </FormItem>
          </Form>
        )
      }
    }`
const DemoAlign = () => (
  <DocViewer
    code={code}
    scope={{ Form, Input, Button, Checkbox }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoAlign
