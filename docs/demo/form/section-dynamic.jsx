import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form'
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

const prefix = 'form-dynamic'
const desc = ['根据数据控制某个表单的显示隐藏']
const leftOptions = ['表单联动', '表单查询']

const code = [
  {
    opt: ['表单联动'],
    code: `import React from 'react'
    import { Form, Grid, Button, Input, Select, Counter, Cascader, Radio, Checkbox, Switch, DatePicker, Rate, Upload  } from '@hi-ui/hiui'\n
    class Demo extends React.Component {  
      constructor(props){
        super(props)
        this.state = {
          initialValues:{
            controlCounter: ['show'],
            select:'3',
            counter:3,
            radio:0,
            rate:3,
            checkbox:[],
            switch:false
          },
          formData: {
            controlCounter: ['show'],
            select:'3',
            counter:3,
            radio:0,
            rate:3,
            checkbox:[],
            switch:false
          },
          singleList: [
            { title:'电视', id:'3', disabled: true },
            { title:'手机', id:'2' },
            { title:'笔记本', id:'4', disabled: true },
            { title:'生活周边', id:'5' },
            { title:'办公', id:'6' },
          ],
          radiolist: [{
            id: 0,
            content: '手机类'
          }, {
            id: 1,
            content: '电脑类'
          }, {
            id: 2,
            content: '生活类'
          }],
          checkboxList: [{
            content: 'DatePicker',
            id: 'DatePicker'
          },{
            content: 'cascader',
            id: 'Cascader'
          },{
            content: 'Radio',
            id: 'Radio'
          }],
          cascaderList:[
            {
              id: '手机',
              content: '手机',
              children: [
                {
                  id: '小米',
                  content: '小米',
                  children: [
                    {
                      id: '小米3',
                      content: '小米3'
                    },
                    {
                      id: '小米4',
                      content: '小米4'
                    },
                  ]
                },
                {
                  id: '红米',
                  content: '红米',
                  children: [
                    {
                      id: '红米3',
                      content: '红米3'
                    },
                    {
                      id: '红米4',
                      content: '红米4'
                    }
                  ]
                }
              ]
            },
            {
              id: '电视',
              content: '电视',
              children: [
                {
                  id: '小米电视4A',
                  content: '小米电视4A'
                },
                {
                  id: '小米电视4C',
                  content: '小米电视4C'
                }
              ]
            }
          ]
        }
        this.form = React.createRef()
      }
      render () {
        const FormItem = Form.Item
        const FormSubmit = Form.Submit
        const FormReset = Form.Reset
        const {initialValues, singleList, radiolist, checkboxList, cascaderList, formData} = this.state
    
        const {controlCounter=[],checkbox} = formData
    
        const Row = Grid.Row
        const Col = Grid.Col
        return (
          <Form 
            labelWidth='140' 
            labelPlacement='right' 
            ref={this.form}
            initialValues={initialValues}
            onValuesChange ={(changedValues,allValues) => {
              console.log('changedValues,allValues',changedValues,allValues)
              this.setState({
                formData: allValues,
              })
            }}
          >
            <FormItem label='表单名称' >
              动态表单
            </FormItem>
            <FormItem label='控制Counter' field="controlCounter">
              <Select
                type='single'
                clearable={false}
                style={{ width: 300 }}
                data={[
                  {
                    id:'hide',
                    title:'隐藏Counter'
                  },
                  {
                    id:'show',
                    title:'显示Counter'
                  }
                ]}
                placeholder="控制Counter的显示隐藏"
                onChange={ids => {
                    console.log('select ids',ids)
                }}
              />
            </FormItem>
    
            { controlCounter[0] === 'show' && 
              <FormItem label='Counter' field="counter" required={true}>
                  <Counter step='1'  min='-10' max='10' />
              </FormItem>
            }
            
            <FormItem 
              label='Checkbox' 
              field="checkbox" 
              rules={{
                trigger:'onChange',
                type: 'array',
                required:true,
              }}>
               <Checkbox.Group data={checkboxList} onChange={(data) => console.log("Checkbox data",data)}/>
            </FormItem>
            
            {
              checkbox.includes('DatePicker') && <FormItem label='DatePicker' field="datePicker" required={true}>
                <DatePicker
                  required={true}
                  type='daterange'
                  format='yyyy-MM-dd'
                  onChange={(date, dateStr) => {console.log('onChange DatePicker', date, dateStr)}}
                />
              </FormItem>
            }
            {
              checkbox.includes('Cascader') &&  <FormItem label='Cascader' field="cascader">
                <Cascader
                  onChange={(id)=>{
                    console.log('Cascader change id', id)
                  }}
                  data={cascaderList}
                    style={{ width: 300 }}
                  />
              </FormItem>
            }
            {
              checkbox.includes('Radio') &&  <FormItem label='Radio' field="radio">
                <Radio.Group
                  data={radiolist}
                  onChange={(data) => console.log("radio data",data)}
                />
              </FormItem>
            }
           
            <FormItem label='Switch' field="switch">
                <Switch content={['ON', 'OFF']} onChange={(val) => console.log('change Switch',val)}/>
            </FormItem>
    
            <FormItem label="Rate" field='rate'>
              <Rate  />
            </FormItem>
            <FormItem label="Upload">
              <Upload
                type="photo"
                uploadAction= "http://www.mocky.io/v2/5dc3b4413000007600347501"
                onChange = {(file, fileList, response) => {
                  file.id = 'file唯一标识'
                  console.log('upload callback', file, fileList, response)
                }}
                onRemove = {(file, fileList, index) => {
                  console.log('remove callback', file, fileList, index)
                  return new Promise((resolve, reject)=>resolve(true))
                }}
                params={{id:'uid',channel:'youpin'}}
                name={'files[]'}
                defaultFileList={[
                  {
                    name: 'b.png',
                    fileType: 'img',
                    uploadState: 'success',
                    url: 'https://i1.mifile.cn/f/i/2018/mix3/specs_black.png'
                  }
                ]}
              />
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
    
              <Button type="primary" appearance="link" onClick={()=>{
                  console.log('填充表单')
                  this.form.current.setFieldsValue({
                    select:'2',
                    phone: "15666666666",
                    radio: 0,
                    rate: 4,
                    counter:0,
                    select: "2",
                    switch: false,
                    datePicker: {start: new Date(), end: new Date()},
                    checkbox:["Phone", "Computer"],
                    cascader:["电视", "小米电视4C"]
                  })
              }}>
                fill Form
              </Button>
            </FormItem>
          </Form>
        )
      }
    }`
  },
  {
    opt: ['表单查询'],
    code: `import React from 'react'
    import { Form, Input, Grid } from '@hi-ui/hiui'
    class Demo extends React.Component {
      constructor () {
        super()
        this.state={
          filesCount: 6
        }
        this.form = React.createRef()
      }
      renderField () {
        const {filesCount} =this.state
    
        const formItems = [];
        for (let i = 0; i < filesCount; i++) {
          formItems.push(
              <Form.Item
                field={'field'+i}
                label={'Field'+i}
                key={'field'+i}
                rules={[
                  {
                    required: true,
                    message: 'Input something!',
                  },
                ]}
              >
                <Input placeholder="placeholder" style={{ width: 200 }}/>
              </Form.Item>
          );
        }
    
        return formItems
      }
      
      render (){
        const FormItem = Form.Item
        const FormSubmit = Form.Submit
        const {filesCount} = this.state
        return (
          <div style={{width:'880px'}}>
            <Form 
              labelWidth='80'
              placement='horizontal' 
              labelPlacement='right' 
              ref={this.form}>
              {
                this.renderField()
              }
            </Form>
            <div style = {{textAlign: 'right', paddingRight: '10px'}}>
              <Button type="primary"  onClick={()=>{
                console.log('填充表单')
                this.form.current.validate((values,errors)=>{
                  console.log('Get form value:',values,errors)
                })
              }}
              >
              查询
            </Button>
            <Button type="line"  onClick={()=>{
                this.form.current.resetValidates(()=>{
                  console.log('重置表单')
                })
             }}
             
            >
            重置
            </Button>
            <Button type="line" appearance="link" icon={filesCount === 9 ? "up":"down"} onClick={()=>{
              this.form.current.resetValidates(()=>{
                console.log('重置表单')
              })
              this.setState({
                filesCount: filesCount === 9 ? 6:9
              })
            }}>{filesCount === 9 ? '收起':'展开更多'}</Button>
          </div>
        </div>
        )
      }
    }`
  }
]

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
    leftOptions={leftOptions}
    desc={desc}
  />
)
export default DemoRow
