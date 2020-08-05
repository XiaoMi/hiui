import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Button from '../../../components/button'
import Select from '../../../components/select'
import Radio from '../../../components/radio'
import Grid from '../../../components/grid'

const prefix = 'form-register'
const desc = ['简单的用户注册表单', '注意onValuesChange的用法']
const code = `import React from 'react'
import { Form, Grid, Radio, Button, Input } from '@hi-ui/hiui'
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
    const FormItem= Form.Item
    const FormSubmit = Form.Submit
    const FormReset = Form.Reset
    const { initialValues, singleList, codeLoading, formData, codeDisabled, countDown } = this.state
    const Row = Grid.Row
    const Col = Grid.Col

    return (
      <Form
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
