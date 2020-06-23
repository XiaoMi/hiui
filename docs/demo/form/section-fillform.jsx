import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Button from '../../../components/button'
import Select from '../../../components/select'

const prefix = 'form-fill'
const desc = '对表单数据域进行交互'
const code = `import React from 'react'
import { Form, Grid, Radio, Button, Input } from '@hi-ui/hiui'\n
class Demo extends React.Component {  
  constructor(props){
    super(props)
    this.state = {
      formData : {
        phone: '',
        password:'',
        remember:'',
        type:'3'
      },
      singleList: [
        { title:'电视', id:'3', disabled: true },
        { title:'手机', id:'2' },
        { title:'笔记本', id:'4', disabled: true },
        { title:'生活周边', id:'5' },
        { title:'办公', id:'6' },
      ],
      
    }
    this.form = React.createRef()
  }
  render (){
    const FormItem = Form.Item
    const FormSubmit = Form.Submit
    const FormReset = Form.Reset
    const {formData,singleList} = this.state

    return (
      <Form labelWidth='80' labelPlacement='left' 
        formRef={this.form}
        initialValues={formData}>
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
          <Input placeholder='请输入手机号' style={{ width: 200 }}
          />
        </FormItem>
        <FormItem label='类型' field="type">
            <Select
            type='single'
            clearable={false}
            style={{ width: 200 }}
            data={singleList}
            onChange={ids => {
            console.log('ids==',ids)
        }}
        />
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
          <Button type="primary" appearance="link" onClick={()=>{
              console.log('填充表单')
          }}>fill Form</Button>
        </FormItem>
      </Form>
    )
  }
}`

const DemoRow = () => (
  <DocViewer
    code={code}
    scope={{ Form, Button, Input, Select }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoRow
