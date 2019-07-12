import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Grid from '../../../components/grid'
import Radio from '../../../components/radio'
import Button from '../../../components/button'
const prefix = 'form-check'

const code = `
import React from 'react'
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
          message: '请输入数量',
          trigger: 'onChange',
          validator: (rule, value, cb) => {
            const count = parseInt(value)
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
    this.form.resetValidates()
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
    const FormItem = Form.Item
    const { form, checkedIndex } = this.state

    return (
      <Row>
        <Col span={12}>
          <Form ref={this.form} model={form} rules={this.state.rules} labelWidth='80'>
            <FormItem label='名称' field='name'>
              <Input value={form.name} placeholder='name' onChange={this.handleChange.bind(this, 'name')}/>
            </FormItem>
            <FormItem label='数量' field='count'>
              <Input value={form.count} placeholder='count' onChange={this.handleChange.bind(this, 'count')}/>
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
              <Button onClick={this.cancelSubmit.bind(this)}>重置</Button>
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
    scope={{ Form, Radio, Grid, Input, Button }}
    prefix={prefix}
  />
)
export default DemoCloseable
