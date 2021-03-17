/* eslint-disable */
import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form, { LegacyForm } from '../../../components/form'
import Input from '../../../components/input'
import Checkbox from '../../../components/checkbox'
import Button from '../../../components/button'
import Grid from '../../../components/grid'
import Radio from '../../../components/radio'
import Select from '../../../components/select'
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
      componentDidMount() {
        this.form.current && this.form.current.setFieldsValue({ productCode: 'SF3423421232', productName: '红米 K40' })
      }
      render (){
        const FormItem = Form.Item
        const FormSubmit = Form.Submit
        const FormReset = Form.Reset
        const {formData} = this.state
        return (
          <Form labelWidth='100' labelPlacement='left' ref={this.form}>
            <FormItem required={true} label="产品编码" field="productCode">
              <Input placeholder="请输入" />
            </FormItem>
            <FormItem required={true} label="产品名称" field="productName">
              <Input placeholder="请输入" />
            </FormItem>
            <FormItem label="" field="productName">
            <FormSubmit type='primary' 
              onClick={(values,errors)=>{
                console.log('Get form value:',values,errors)}
              }
              >提交</FormSubmit>
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
  },
  {
    code: `import React from 'react'
    import { Grid, Button, Radio, Input, LegacyForm } from '@hi-ui/hiui'
    
    class Demo extends React.Component {
      constructor() {
        super()
        this.form = React.createRef()
        this.state = {
          form: {
            name: '',
            region: '',
            count: ''
          },
          checkedIndex: -1,
          rules: {
            name: {
              required: true,
              message: <span style={{color: '#ccc'}}>请输入名称</span>,
              trigger: 'onBlur,onChange'
            },
            region: {
              required: true,
              message: '请选择区域',
              trigger: 'onChange'
            },
            count: {
              required: true,
              trigger: 'onChange',
              validator: (rule, value, cb) => {
                const count = +value
                if(isNaN(count)) {
                  cb('请输入数字')
                } else if(count <= 0) {
                  cb('必须是正数')
                } else {
                  cb()
                }
              }
            }
          }
        }
      }
    
      handleSubmit() {
        this.form.current.validate(valid => {
          if(valid) {
            console.log(this.state.form)
            alert('submit')
          } else {
            console.log('error')
            return false
          }
        })
      }
    
      cancelSubmit() {
        this.setState({
          form: {
            name: '',
            region: '',
            count: ''
          }
        })
        this.form.current.resetValidates()
      }
    
      handleChange(key, e, value, index) {
        this.setState({
          form: Object.assign({}, this.state.form, {[key]: value})
        })
    
        if(index !== undefined) {
          this.setState({
            checkedIndex: index
          })
        }
      }
    
      render(){
        const Row = Grid.Row
        const Col = Grid.Col
        const FormItem = LegacyForm.Item
        const { form, checkedIndex } = this.state
    
        return (
          <Row>
            <Col span={12}>
              <LegacyForm ref={this.form} model={form} rules={this.state.rules} labelWidth='80' labelPlacement='right'>
                <FormItem label='名称' field='name'>
                  <Input value={form.name} placeholder='请输入' onChange={this.handleChange.bind(this, 'name')}/>
                </FormItem>
                <FormItem label='数量' field='count'>
                  <Input value={form.count} placeholder='请输入' onChange={this.handleChange.bind(this, 'count')}/>
                </FormItem>
                <FormItem label='地区' field='region'>
                  <Radio.Group
                    data={['北京', '上海', '重庆']}
                    value={form.region}
                    onChange={this.handleChange.bind(this, 'region','')}
                  />
                </FormItem>
                <FormItem>
                  <Button type='primary' onClick={this.handleSubmit.bind(this)}>提交</Button>
                  <Button type='line' onClick={this.cancelSubmit.bind(this)}>重置</Button>
                </FormItem>
              </LegacyForm>
            </Col>
          </Row>
        )
      }
    }`,
    opt: ['v2']
  },
  {
    code: `import React from 'react'
  import { Form, Grid, Radio, Button, Input } from '@hi-ui/hiui'\n
    class Demo extends React.Component {  
      constructor(props) {
        super(props)
        this.state = {
          formData: {
            phone: '',
            Select: ''
          },
          initialValues: {
            phone: '初始值',
            Select: ['3']
          }
        }
        this.form1 = React.createRef()
        this.form2 = React.createRef()
      }
    
      static getDerivedStateFromProps(props, state) {
        // 更新 state 使下一次渲染可以显降级 UI
        console.log('initialValues', props.initialValues)
        return {
          formData: {
            ...props.initialValues
          }
        }
      }
    
      render() {
        const FormItem = Form.Item
        const { formData, initialValues } = this.state
        console.log('formData', formData)
    
        return (
          <div>
            <Form labelWidth="70" labelPlacement="left" ref={this.form1}>
              <FormItem
                label="手机号"
                field="phone"
                rules={{
                  trigger: 'onChange',
                  type: 'number',
                  validator: (rule, value, callback) => {
                    const telReg = /^[1][3|4|5|6|7|8|9][0-9]{9}$/
                    if (!value) {
                      callback('请输入手机号')
                    } else if (!telReg.test(value)) {
                      callback('请输入正确的手机号')
                    } else {
                      callback()
                    }
                  }
                }}
              >
                <Input placeholder={'请输入'} />
              </FormItem>
              <FormItem label="门店" field="Select" required={true}>
                <Select
                  data={[
                    { title: '电视', id: '3' },
                    { title: '手机', id: '2' },
                    { title: '笔记本', id: '4' },
                    { title: '生活周边', id: '5' },
                    { title: '办公', id: '6' }
                  ]}
                  type="multiple"
                  searchable
                  showCheckAll
                  placeholder="请选择"
                  emptyContent="无匹配数据"
                  onChange={(item) => {
                    this.form1.current.setFieldsValue({
                      Select2: ['6']
                    })
                    console.log('多选结果', item)
                  }}
                />
              </FormItem>
              <FormItem label="门店2" field="Select2" required={true}>
                <Select
                  data={[
                    { title: '电视', id: '3' },
                    { title: '手机', id: '2' },
                    { title: '笔记本', id: '4' },
                    { title: '生活周边', id: '5' },
                    { title: '办公', id: '6' }
                  ]}
                  type="multiple"
                  searchable
                  showCheckAll
                  placeholder="请选择"
                  emptyContent="无匹配数据"
                  onChange={(item) => {
                    console.log('多选结果', item)
                  }}
                />
              </FormItem>
            </Form>
    
            <Button
              type="primary"
              onClick={() => {
                this.form1.current.validate((value, error) => {
                  console.log(value, error)
                })
              }}
            >
              提交
            </Button>
            <Button
              type="primary"
              onClick={() => {
                this.form1.current.setFieldsValue({
                  phone: '15652959628',
                  Select2: ['6'],
                  Select: ['3']
                })
              }}
            >
              fill
            </Button>
          </div>
        )
      }
    }`,
    opt: ['值联动']
  },
]
const DemoAlign = () => (
  <DocViewer
    code={code}
    scope={{ Form, Input, Button, Checkbox, LegacyForm, Grid, Radio, Select }}
    prefix={prefix}
    desc={desc}
    rightOptions={rightOptions}
  />
)
export default DemoAlign
