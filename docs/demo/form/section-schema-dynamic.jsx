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
import Grid from '../../../components/grid'

const prefix = 'form-schema'
const desc = '通过schema配置表单，现仅支持HiUI组件'
const code = `import React from 'react'
import { Form,Counter} from '@hi-ui/hiui'\n
class Demo extends React.Component {  
  constructor(props){
    super(props)
    this.state = {
      initialValues : {
        inputField: 'test schema',
        selectField: "3",
      },
      formData:{
        inputField: 'test schema',
        selectField: "3",
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
                style:{ width: 300 } 
            }
          },
          {
            label:'下拉框',
            field:'selectField',
            component:'Select',
            required:true,
            componentProps:{
                placeholder:'schema',
                style:{ width: 300 },
                data:[
                  { title:'电视', id:'3', disabled: true },
                  { title:'手机', id:'2' },
                  { title:'笔记本', id:'4', disabled: true },
                  { title:'生活周边', id:'5' },
                  { title:'办公', id:'6' }
                ],
            }
          },
          {
            label:'显示日期',
            field:'Switch',
            component:'Switch',
            componentProps:{
              content:['ON', 'OFF'],
              onChange: (val) => console.log('change Switch',val)
            }
          },
          {
            label:'日期',
            field:'datePicker',
            component:'DatePicker',
            required:true,
            componentProps:{
              type:'daterange',
              format:'yyyy-MM-dd',
              onChange:(date, dateStr) => {console.log('onChange DatePicker', date, dateStr)}
            }
          }
      ]
    }
  }
  render () {
    const FormItem = Form.Item
    const FormSubmit = Form.Submit
    const FormReset = Form.Reset
    const SchemaForm = Form.SchemaForm
    const {initialValues, formData} = this.state

    return (
      <SchemaForm 
        labelWidth='100' 
        labelPlacement='right' 
        initialValues={initialValues}
        schema={this.state.formSchema}
        schemaformValue={formData}
        submit={{
          type:'primary',
          children:'提交',
          onClick:(value,errors) => {console.log('value,errors', value,errors)}
        }}
        reset={{
          type:'line',
          children:'重置',
          onClick:() => {console.log('reset form')}
        }}
        onValuesChange ={(changedValues,allValues) => {
         console.log("formdata",changedValues,allValues)
         this.setState({
          formData: allValues
         })
        }}
      />
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
      Upload,
      Grid
    }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoRow
