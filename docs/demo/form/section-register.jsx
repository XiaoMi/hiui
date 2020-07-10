import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Button from '../../../components/button'
import Select from '../../../components/select'
import Radio from '../../../components/radio'
import Grid from '../../../components/grid'

const prefix = 'form-register'
const desc = '简单的用户注册表单'
const code = `import React from 'react'
import { Form, Grid, Radio, Button, Input } from '@hi-ui/hiui'
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      initialValues: {
        phone: '',
        select: '3'
      },
      formData: ''
    }
    this.form = React.createRef()
  }
  render() {
    const FormItem= Form.Item
    const FormSubmit = Form.Submit
    const FormReset = Form.Reset
    const { initialValues, singleList } = this.state
    const Row = Grid.Row
    const Col = Grid.Col

    return (
      <Form
        labelWidth='80'
        labelPlacement='right'
        ref={this.form}
        initialValues={initialValues}
        onValuesChange ={(changedValues,allValues) => {
          console.log("changedValues:",changedValues ,"allValues:",allValues)
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
          <Input placeholder='请输入手机号' style={{ width: 200 }} />
        </FormItem>
        <Row>
          <Col>
            <FormItem
              label='验证码'
              field='code'
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
              <Input placeholder='请输入验证码' style={{ width: 200 }} />
            </FormItem>
          </Col>
          <Col>
            <Button
              type='primary'
              appearance='link'
              onClick={() => {
                console.log('获取验证码')
              }}
            >
              获取验证码
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
          
          <Input type='password' placeholder='请输入手机号' style={{ width: 200 }} />
        </FormItem>

        <FormItem
            label='确认密码'
            field='passWordValidate'
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
            <Input type='password' placeholder='请再次输入密码' style={{ width: 200 }} />
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
          <Button
            type='primary'
            appearance='link'
            onClick={() => {
              console.log('填充表单')
              this.form.current.setFieldsValue({
                phone: '15652959628',
                select: '2'
              })
            }}
          >
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
    scope={{ Form, Button, Input, Select, Radio, Grid }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoRow
