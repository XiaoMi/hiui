import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Button from '../../../components/button'
import Select from '../../../components/select'
import Radio from '../../../components/radio'
import Grid from '../../../components/grid'
import Counter from '../../../components/counter'

const prefix = 'form-schema'
const desc = '通过schema配置表单，现仅支持HiUI组件'
const code = `import React from 'react'
import { Form,Counter} from '@hi-ui/hiui'\n
class Demo extends React.Component {  
  constructor(props){
    super(props)
    this.state = {
      formData : {
        inputField: 'test schema',
        selectField: "3",
        counter:1,
        date:'',
      },
      formSchema:[
          {
            label:'输入框',
            field:'inputField',
            rules:[{ min: 5, max: 16, message: '长度在 6 到 16 个字符', trigger: 'onBlur' }],
            component:'Input',
            componentProps:{
                placeholder:'schema',
                clearable:true,
            }
          },
          {
            label:'下拉框',
            field:'selectField',
            component:'Select',
            required:true,
            componentProps:{
                placeholder:'schema',
                data:[
                  { title:'电视', id:'3', disabled: true },
                  { title:'手机', id:'2' },
                  { title:'笔记本', id:'4', disabled: true },
                  { title:'生活周边', id:'5' },
                  { title:'办公', id:'6' }
                ],

            }
          }
      ]
    }
    this.form = React.createRef()
  }
  render () {
    const FormItem = Form.Item
    const FormSubmit = Form.Submit
    const FormReset = Form.Reset
    const SchemaForm = Form.SchemaForm

    const {formData} = this.state
    const Row = Grid.Row
    const Col = Grid.Col
    return (
      <SchemaForm 
        labelWidth='100' 
        labelPlacement='right' 
        ref={this.form}
        initialValues={formData}
        schema={this.state.formSchema}
        >
        <FormItem 
          label='日期' 
          field="date" 
          required={true} 
          component="DatePicker" 
          componentProps={{
            type:'daterange',
            format:'yyyy-MM-dd',
            onChange:(date, dateStr) => {console.log('onChange DatePicker', date, dateStr)}
          }}
        />
        <FormItem label='Counter' field="counter" required={true}>
            <Counter step='1'  min='-10' max='10' />
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
      </SchemaForm>
    )
  }
}`

const DemoRow = () => (
  <DocViewer
    code={code}
    scope={{ Form, Button, Input, Select, Radio, Grid, Counter }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoRow
