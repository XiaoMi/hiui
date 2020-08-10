import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Grid from '../../../components/grid'
import Radio from '../../../components/radio'
import Button from '../../../components/button'
import Select from '../../../components/select'
import Cascader from '../../../components/cascader'
import Icon from '../../../components/icon'
import DatePicker from '../../../components/date-picker'
const prefix = 'form-list'
const leftOptions = ['单表单项', '嵌套表单项']
const desc = '动态更改表单项'
const code = [
  {
    opt: ['单表单项'],
    code: `import React from 'react'
    import { Grid, Button, Radio, Input, Form } from '@hi-ui/hiui'\n
    class Demo extends React.Component {
      constructor() {
        super()
        this.form = React.createRef()
        this.state = {
          initialValues:{
            testList:['第一项','第二项']
          },
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
        const FormItem = Form.Item
        const FormList = Form.List
        const FormSubmit = Form.Submit
        const FormReset = Form.Reset
        const {initialValues} = this.state
        return (
            <Row>
            <Col span={12}>
              <Form
                initialValues={initialValues}
                ref={this.form}
                rules={this.state.rules}
                labelWidth='80'
                labelPlacement='right'
                onValuesChange={(changedValues, allValues) => {
                  console.log(
                    'changedValues:',
                    changedValues,
                    'allValues:',
                    allValues
                  )
                }}
              >
                <FormList name='testList'>
                  {(fields, { add, remove }) => {
                    return (
                      <div className='list'>
                        {fields.map((field, index) => (
                          <div style={{ display: 'flex' }} key={index}>
                            <FormItem
                              {...field}
                              label={index === 0 ? 'testList' : ''}
                            >
                              <Input placeholder='请输入' style={{width:'200px'}}/>
                            </FormItem>
                            <span style={{paddingTop:'6px'}}>
                              <Icon
                                name='close'
                                style={{
                                  color: '#999',
                                  fontSize: '16px',
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  remove(field)
                                }}
                             />
                            </span>
                           
                          </div>
                        ))}
                        <div style={{ 
                            marginLeft: '80px',
                            width: "200px",
                            textAlign: "center",
                            border: '1px dashed #ccc',
                            borderRadius: '2px',
                            marginBottom: '24px',
                        }}>
                          <Button
                            type='line'
                            appearance='link'
                            icon='plus'
                            onClick={() => {
                              add()
                            }}
                          >
                            添加选项
                          </Button>
                        </div>
                      </div>
                    )
                  }}
                </FormList>
    
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
                  <Button type="primary" appearance="link" onClick={()=>{
                    console.log('填充表单')
                    this.form.current.setFieldsValue({
                      testList:[1,2,3]
                    })
                }}>fill Form</Button>
                </FormItem>
              </Form>
            </Col>
          </Row>
        )
      }
    }`
  },
  {
    opt: ['嵌套表单项'],
    code: `import React from 'react'
    import { Grid, Button, Radio, Input, Form } from '@hi-ui/hiui'\n
    class Demo extends React.Component {
      constructor() {
        super()
        this.form = React.createRef()
        this.state = {
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
        const FormItem = Form.Item
        const FormList = Form.List
        const FormSubmit = Form.Submit
        const FormReset = Form.Reset
    
        return (
            <Row>
            <Col span={12}>
              <Form
                ref={this.form}
                rules={this.state.rules}
                labelWidth='80'
                labelPlacement='right'
                onValuesChange={(changedValues, allValues) => {
                  console.log(
                    'changedValues:',
                    changedValues,
                    'allValues:',
                    allValues
                  )
                }}
              >
                <FormList name='testList'>
                  {(fields, { add, remove }) => {
                    return (
                      <div className='list'>
                        {fields.map((field, index) => (
                          <div style={{ display: 'flex' }} key={index}>
                            <FormItem
                              {...field}
                              name = 'first'
                            >
                              <Input placeholder='请输入' style={{width:'200px'}}/>
                            </FormItem>
                            <FormItem
                              {...field}
                              labelWidth='0'
                              name = 'last'
                            >
                              <Input placeholder='请输入' style={{width:'200px'}}/>
                            </FormItem>
                            <Icon
                              name='close'
                              style={{
                                color: '#999',
                                fontSize: '16px',
                                cursor: 'pointer',
                                height:'18px',
                                marginTop:'4px',
                              }}
                              onClick={() => {
                                remove(field)
                              }}
                            />
                          </div>
                        ))}
                        <div style={{ 
                            marginLeft: '80px',
                            width: "200px",
                            textAlign: "center",
                            border: '1px dashed #ccc',
                            borderRadius: '2px',
                            marginBottom: '24px',
                        }}>
                          <Button
                            type='line'
                            appearance='link'
                            icon='plus'
                            onClick={() => {
                              add()
                            }}
                          >
                            添加选项
                          </Button>
                        </div>
                      </div>
                    )
                  }}
                </FormList>
    
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
                  <Button type="primary" appearance="link" onClick={()=>{
                    console.log('填充表单')
                    this.form.current.setFieldsValue({
                      testList:[
                        {
                          first: "123",
                          last: "rrr"
                        }]
                    })
                }}>fill Form</Button>
                </FormItem>
              </Form>
            </Col>
          </Row>
        )
      }
    }`
  }
]
const DemoCloseable = () => (
  <DocViewer
    code={code}
    scope={{
      Form,
      Radio,
      Grid,
      Input,
      Button,
      Select,
      Cascader,
      DatePicker,
      Icon
    }}
    prefix={prefix}
    leftOptions={leftOptions}
    desc={desc}
  />
)
export default DemoCloseable
