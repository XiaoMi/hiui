import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Grid from '../../../components/grid'
import Radio from '../../../components/radio'
import Button from '../../../components/button'
import Select from '../../../components/select'
import Cascader from '../../../components/cascader'
import DatePicker from '../../../components/date-picker'
const prefix = 'form-check'
const desc = '表单项内容的格式、逻辑有特殊要求'
const code = `import React from 'react'
import { Grid, Button, Radio, Input, Form } from '@hi-ui/hiui'\n
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
    const FormItem = Form.Item
    const { form, checkedIndex } = this.state

    return (
      <Row>
        <Col span={12}>
          <Form ref={this.form} model={form} rules={this.state.rules} labelWidth='80' labelPlacement='right'>
            <FormItem label='名称' field='name'>
              <Input placeholder='请输入'/>
            </FormItem>
            <FormItem label='数量' field='count' rules={{
              required: true,
              message: '请输入数量123',
              trigger: 'onChange'
            }}>
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
          </Form>
        </Col>
      </Row>
    )
  }
}`
const DemoCloseable = () => (
  <DocViewer
    code={code}
    scope={{ Form, Radio, Grid, Input, Button, Select, Cascader, DatePicker }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoCloseable
