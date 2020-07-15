import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Button from '../../../components/button'
import Select from '../../../components/select'
import Counter from '../../../components/counter'
import Cascader from '../../../components/cascader'
import Radio from '../../../components/radio'
import Checkbox from '../../../components/checkbox'
import Switch from '../../../components/switch'
import DatePicker from '../../../components/date-picker'
import Rate from '../../../components/rate'
import Upload from '../../../components/upload'

const prefix = 'form-rules'
const desc = '常用规则校验的一些用法'
const code = `import React from 'react'
import { Form, Grid, Button, Input, Select, Counter, Cascader, Radio, Checkbox, Switch, DatePicker, Rate, Upload  } from '@hi-ui/hiui'\n
class Demo extends React.Component {  
  constructor(props){
    super(props)
    this.form = React.createRef()
  }
  render (){
    const FormItem = Form.Item
    const FormSubmit = Form.Submit
    const FormReset = Form.Reset

    return (
      <Form 
        labelWidth='100' 
        labelPlacement='right' 
        ref={this.form}>

        <FormItem label='表单名称' >
          表单rules使用样例
         </FormItem>
        <FormItem label='自定义' field="useValidator" rules={{
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
          <Input placeholder='自定义校验手机号' style={{ width: 300 }}
          />
        </FormItem>
        <FormItem label='角色' field="role" rules={{
          trigger:'onChange',
          type:'enum',
          required:true,
          enum:['admin', 'user', 'guest'],
          }}>
          <Input placeholder='只能输入指定字符' style={{ width: 300 }}
          />
        </FormItem>
        <FormItem label='邮箱校验' field="patternEmail" rules={{
          trigger:'onChange',
          type:'email',
          required:true,
          message: '请输入正确的邮箱'
          }}>
          <Input placeholder='请输入' style={{ width: 300 }}
          />
        </FormItem>
        <FormItem label='长度限制' field="len" rules={{
          trigger:'onChange',
          type:'string',
          required:true,
          max:140,
          min:10
          }}>
          <Input type="textarea" placeholder='请输入10-140的评论' style={{ width: 300 }} />
        </FormItem>
        <FormItem label='空格校验' field="whitespace" rules={{
            trigger:'onChange',
            type:'string',
            required:true,
            whitespace:true,
          }}>
          <Input placeholder="仅有空格的输入是无效的" style={{ width: 300 }} />
        </FormItem>
      
        <FormItem>
         <FormSubmit type='primary' 
          onClick={(values,errors)=>{
            console.log('Get form value:',values,errors)}
          }>
            提交
          </FormSubmit>

          <FormReset type='line' 
            onClick={()=>{console.log('reset form')}} >
            重置
          </FormReset>
        </FormItem>
      </Form>
    )
  }
}`

const DemoRow = () => (
  <DocViewer
    code={code}
    scope={{
      Form,
      Button,
      Input,
      Select,
      Counter,
      Cascader,
      Radio,
      Checkbox,
      Switch,
      DatePicker,
      Rate,
      Upload
    }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoRow
