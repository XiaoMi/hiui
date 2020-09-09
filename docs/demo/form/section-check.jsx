import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import HiForm from '../../../components/form'
import Input from '../../../components/input'
import Grid from '../../../components/grid'
import Radio from '../../../components/radio'
import Button from '../../../components/button'
import Select from '../../../components/select'
import Cascader from '../../../components/cascader'
import DatePicker from '../../../components/date-picker'
const prefix = 'form-check'
const leftOptions = [
  '表单验证',
  '校验指定表单项',
  '填充表单',
  '表单验证快捷用法'
]

const desc = [
  '对表单数据域进行交互',
  '控制表单项的值',
  '表单项内容的格式、逻辑有特殊要求',
  '可在Form中配置全部Item的rules,也可在Form.Item中使用rules校验单个表单项'
]
const code = [
  {
    opt: ['表单验证'],
    code: `import React from 'react'
    import { Grid, Button, Radio, Input, HiForm } from '@hi-ui/hiui'\n
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
        this.form.current.validate((valid,error) => {
          if(!error) {
            console.log(valid)
            alert('submit')
          } else {
            console.log('error',error)
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
    
    
      render(){
        const Row = Grid.Row
        const Col = Grid.Col
        const FormItem = HiForm.Item
        const { form, checkedIndex } = this.state
    
        return (
          <Row>
            <Col span={12}>
              <HiForm 
                ref={this.form} 
                model={form} 
                rules={this.state.rules} 
                labelWidth='80' 
                labelPlacement='right'>
                <FormItem label='名称' field='name'>
                  <Input placeholder='请输入'/>
                </FormItem>
                <FormItem label='数量' field='count'>
                  <Input placeholder='请输入'/>
                </FormItem>
                <FormItem label='地区' field='region'>
                  <Radio.Group
                    data={['北京', '上海', '重庆']}
                  />
                </FormItem>
                <FormItem>
                  <Button type='primary' onClick={this.handleSubmit.bind(this)}>提交</Button>
                  <Button type='line' onClick={this.cancelSubmit.bind(this)}>重置</Button>
                </FormItem>
              </HiForm>
            </Col>
          </Row>
        )
      }
    }`
  },
  {
    opt: ['校验指定表单项'],
    code: `import React from 'react'
    import { HiForm, Grid, Radio, Button, Input } from '@hi-ui/hiui'
    class Demo extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          initialValues: {
            phone: '',
            select: '3',
          },
          formData: '',
          countDown: 60,
    
          codeDisabled: false
        }
        this.form = React.createRef()
    
      }
      getCode () {
        
        let countDownTime
    
        countDownTime = setInterval(()=>{
          const {countDown} = this.state
          if(countDown-1 <=0){
            clearInterval(countDownTime)
            this.setState({
              countDown: false,
              countDown: 60
            })
            return
          }
          this.setState({
            countDown: countDown-1
          })
        },1000)
      }
      render() {
        const FormItem= HiForm.Item
        const FormSubmit = HiForm.Submit
        const FormReset = HiForm.Reset
        const { initialValues, singleList, codeLoading, formData, codeDisabled, countDown } = this.state
        const Row = Grid.Row
        const Col = Grid.Col
    
        return (
          <HiForm
            labelWidth='80'
            labelPlacement='right'
            ref={this.form}
            initialValues={initialValues}
            onValuesChange ={(changedValues,allValues) => {
              this.setState({
                formData: allValues,
              })
            }}
          >
            <FormItem
              label='手机号'
              field='phone'
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
              <Input placeholder='请输入手机号' style={{ width: 240 }} />
            </FormItem>
            <Row>
              <Col>
                <FormItem
                  label='验证码'
                  field='code'
                  rules={{
                    trigger: 'onChange',
                    validator: (rule, value, callback) => {
                      const telReg = /^[0-9]{6}$/
                      if (!value) {
                        callback('请输入手机号')
                      } else if (!telReg.test(value)) {
                        callback('请输入正确的验证码')
                      } else {
                        callback()
                      }
                    }
                  }}
                >
                  <Input placeholder='请输入验证码' style={{ width: 130 }} />
                </FormItem>
              </Col>
              <Col>
                <Button
                  type='primary'
                  disabled = {codeDisabled && countDown <= 60 && countDown>= 0}
                  onClick={() => {
                    const telReg = /^[1][3|4|5|6|7|8|9][0-9]{9}$/
                    this.form.current.validateField('phone',(errors)=>{
                      console.log('errors',errors)
                      if(!errors) {
                        this.setState({
                          codeDisabled: true
                        },()=>{
                          this.getCode()
                        })
                      }
                    })
                  }}
                >
                  获取验证码{countDown < 60 && countDown>= 0 && countDown}
                </Button>
              </Col>
            </Row>
            <FormItem
              label='密码'
              field='passWord'
              rules={{
                trigger: 'onChange',
                type: 'number',
                validator: (rule, value, callback) => {
                  const telReg = /^(?![^a-zA-Z]+$)(?!\\D+$).{8,16}$/
                  if (!value) {
                    callback('请输入密码')
                  } else if (!telReg.test(value)) {
                    callback('请输入包括数字和字母、长度8到16位的密码组合')
                  } else {
                    callback()
                  }
                }
              }}
            >
              <Input type='password' placeholder='请输入' style={{ width: 240 }} />
            </FormItem>
    
            <FormItem
                label='确认密码'
                field='passWorConfirm'
                rules={{
                  trigger: 'onChange',
                  type: 'number',
                  validator: (rule, value, callback) => {
                    const {formData:{passWord}} = this.state
                    if (value !== passWord) {
                      callback('两次密码不同')
                    } else {
                      callback()
                    }
                  }
                }}
              >
                <Input type='password' placeholder='请再次输入密码' style={{ width: 240 }} />
            </FormItem>
           
            <FormItem>
              <FormSubmit
                type='primary'
                onClick={(values, errors) => {
                  console.log('Get form value:', values, errors)
                }}
              >
                提交
              </FormSubmit>
              <FormReset
                type='line'
                onClick={() => {
                  console.log('reset form')
                }}
              >
                重置
              </FormReset>
            </FormItem>
          </HiForm>
        )
      }
    }`
  },
  {
    opt: ['填充表单'],
    code: `import React from 'react'
    import { HiForm, Grid, Radio, Button, Input } from '@hi-ui/hiui'\n
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
        const FormItem = HiForm.Item
        const FormSubmit = HiForm.Submit
        const FormReset = HiForm.Reset
        const {formData,singleList} = this.state
        const Row = Grid.Row
        const Col = Grid.Col
    
        return (
          <HiForm 
            labelWidth='80' 
            labelPlacement='right' 
            ref={this.form}
            initialValues={formData}>
            <Row>
            <Col>
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
                    <Input placeholder='请输入手机号' style={{ width: 200 }}
                    />
                </FormItem>
            </Col>
            <Col>
                 <a href="#Props" style={{ margin: '0 8px',lineHeight:'32px' }}>
                    Need Help?
                </a>
            </Col>
          </Row>
            <FormItem label='Select' field="select" required={true}>
                <Select
                type='single'
                clearable={false}
                style={{ width: 200 }}
                data={singleList}
                onChange={ids => {
                    console.log('select ids',ids)
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
                  this.form.current.setFieldsValue({
                    phone:'15652959628',
                    select:'2'
                  })
              }}>fill HiForm</Button>
            </FormItem>
          </HiForm>
        )
      }
    }`
  },
  {
    opt: ['表单验证快捷用法'],
    code: `import React from 'react'
    import { HiForm, Grid, Button, Input, Select, Counter, Cascader, Radio, Checkbox, Switch, DatePicker, Rate, Upload  } from '@hi-ui/hiui'\n
    class Demo extends React.Component {  
      constructor(props){
        super(props)
        this.form = React.createRef()
      }
      render (){
        const FormItem = HiForm.Item
        const FormSubmit = HiForm.Submit
        const FormReset = HiForm.Reset
    
        return (
          <HiForm 
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
          </HiForm>
        )
      }
    }`
  }
]

const DemoCloseable = () => (
  <DocViewer
    code={code}
    leftOptions={leftOptions}
    scope={{ HiForm, Radio, Grid, Input, Button, Select, Cascader, DatePicker }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoCloseable
