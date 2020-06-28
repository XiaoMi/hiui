import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Button from '../../../components/button'
import Select from '../../../components/select'
import Radio from '../../../components/radio'
import Grid from '../../../components/grid'

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
        select:'3'
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
    const Row = Grid.Row
    const Col = Grid.Col

    return (
      <Form 
        labelWidth='80' 
        labelPlacement='right' 
        ref={this.form}
        initialValues={formData}
        schema={
            [
                {
                    component:'Input',
                    componentProps:{
                        placeholder:'schema'
                    }
                }
            ]
        }
        >
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
              this.form.current.setFieldsValue({
                phone:'15652959628',
                select:'2'
              })
          }}>fill Form</Button>
        </FormItem>
      </Form>
    )
  }
}`

const DemoRow = () => (
  <DocViewer
    code={code}
    scope={{ Form, Button, Input, Select, Radio, Grid }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoRow
