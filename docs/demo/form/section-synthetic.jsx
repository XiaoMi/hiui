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

const prefix = 'form-synthetic'
const desc = '展示和表单相关的其他组件'
const code = `import React from 'react'
import { Form, Grid, Button, Input, Select, Counter, Cascader, Radio, Checkbox, Switch, DatePicker, Rate, Upload  } from '@hi-ui/hiui'\n
class Demo extends React.Component {  
  constructor(props){
    super(props)
    this.state = {
      formData : {
        phone: '',
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
        content: '手机',
        id: 'Phone'
      },{
        content: '电脑',
        id: 'Computer'
      },{
        content: '智能',
        id: 'Intelli'
      },{
        content: '出行',
        id: 'Transfer',
        disabled: true
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
  render (){
    const FormItem = Form.Item
    const FormSubmit = Form.Submit
    const FormReset = Form.Reset
    const {formData,singleList,cascaderList,radiolist,checkboxList} = this.state
    const Row = Grid.Row
    const Col = Grid.Col
    return (
      <Form labelWidth='100' labelPlacement='right' 
        ref={this.form}
        initialValues={formData}>
        <FormItem label='表单名称' >
        <p>组合表单</p>
       </FormItem>
        <FormItem label='Input' field="phone" rules={{
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
          <Input placeholder='请输入手机号' style={{ width: 300 }}
          />
        </FormItem>
        <FormItem label='Counter' field="counter" required={true}>
            <Counter step='1'  min='-10' max='10' />
        </FormItem>
       
        <FormItem label='Cascader' field="cascader">
         <Cascader
            onChange={(id)=>{
              console.log('Cascader change id', id)
            }}
            data={cascaderList}
            style={{ width: 300 }}
          />
        </FormItem>
        <FormItem label='Checkbox' field="checkbox" rules={{
          trigger:'onChange',
          type: 'array',
          required:true,
          }}>
           <Checkbox.Group data={checkboxList} onChange={(data) => console.log("Checkbox data",data)}/>
        </FormItem>
        <Row>
          <Col>
            <FormItem label='address' field="province" required={true}>
              <Select
                type='single'
                clearable={false}
                style={{ width: 95 }}
                data={[
                  {
                    id:'1010',
                    title:'北京'
                  },
                  {
                    id:'1011',
                    title:'河南'
                  }
                ]}
                placeholder="省"
                onChange={ids => {
                    console.log('select ids',ids)
                }}
              />
            </FormItem>
          </Col>

          <Col>
            <FormItem field="city" labelWidth='0' required={true}>
              <Select
                type='single'
                clearable={false}
                style={{ width: 95 }}
                data={[]}
                placeholder="市"

                onChange={ids => {
                    console.log('select ids',ids)
                }}
              />
            </FormItem>
          </Col>

          <Col>
            <FormItem field="county" labelWidth='0' required={true}>
              <Select
                type='single'
                clearable={false}
                style={{ width: 95 }}
                data={[]}
                placeholder="区"
                onChange={ids => {
                    console.log('select ids',ids)
                }}
              />
          </FormItem>
          </Col>
        </Row>
        
        <FormItem label='Radio' field="radio">
          <Radio.Group
            data={radiolist}
            onChange={(data) => console.log("radio data",data)}
          />
        </FormItem>
       
       
        <FormItem label='DatePicker' field="datePicker">
          <DatePicker
            type='daterange'
            format='yyyy-MM-dd'
            onChange={(date, dateStr) => {console.log('onChange DatePicker', date, dateStr)}}
          />
        </FormItem>
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
