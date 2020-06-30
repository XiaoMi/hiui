import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Button from '../../../components/button'
import Select from '../../../components/select'
import Radio from '../../../components/radio'
import Grid from '../../../components/grid'

const prefix = 'form-hooks'
const desc = '通过 Form.useForm 对表单数据域进行交互'
const code = `import React from 'react'
import { Form, Grid, Radio, Button, Input } from '@hi-ui/hiui'\n
(props) => {
    const {FormWrapper,FormInstance,FormItem} = Form.useForm()

    return (
        <>
        <FormWrapper 
            labelWidth='80'
            labelPlacement='right'
            initialValues = {{ phone: '16666666666' }}
        >
        <FormItem label='Input' field="phone"  rules={{
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
           <Input placeholder='请输入手机号' style={{ width: 200 }}/>
        </FormItem>
      </FormWrapper>
      <div style={{marginLeft:'80px'}}>
        <Button 
            type='primary' 
            onClick={()=>{
                FormInstance.validate((values,errors)=>{
                    console.log('Get form value:',values,errors)
                })
            }}
        >
            提交
        </Button>

        <Button 
            type='line' 
            onClick={()=>{
                FormInstance.resetValidates(()=>{
                    console.log('reset form')
                })
            }}
        >
            重置
        </Button>

        <Button type="primary" appearance="link" onClick={()=>{
                console.log('填充表单',FormInstance)
                FormInstance.setFieldsValue({
                phone:'15652959628',
                })
            }}
        >
            fill Form
        </Button>
      </div>
     
      </>
    )
} `

const DemoRow = () => (
  <DocViewer
    code={code}
    scope={{ Form, Button, Input, Select, Radio, Grid }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoRow
