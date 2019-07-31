import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form'
import Input from '../../../components/input'
import Grid from '../../../components/grid'
import Radio from '../../../components/radio'
import Button from '../../../components/button'
const prefix = 'form-check'

const code = `
import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Button from '@hi-ui/hiui/es/button'
import Radio from '@hi-ui/hiui/es/radio'
import Input from '@hi-ui/hiui/es/input'
import Form from '@hi-ui/hiui/es/form'\n
class Demo extends React.Component {
  constructor(props) {
    super(props)

    this.form = React.createRef()

    this.state = {
      form: {
        name: '',
        region: '',
        count: ''
      },
      checkedIndex: -1,
      rules: {
        name: [
          {
            required: true,
            message: <span style={{color: '#ccc'}}>请输入名称</span>,
            trigger: 'onBlur,onChange'
          }
        ],
        region: [
          {
            required: true,
            message: '请选择区域',
            trigger: 'onChange'
          }
        ],
        count: [
          {
            required: true,
            message: '请输入数量',
            trigger: 'onChange'
          },
          {
            validator: (rule, value, cb) => {
              const count = parseInt(value)
              if(isNaN(count)) {
                cb('请输入数字')
              } else if(count <= 0) {
                cb('必须是正数')
              } else {
                cb()
              }
            },
            trigger: 'onChange'
          }
        ]
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
    const {form, checkedIndex} = this.state

    return (
      <div>
        <Form ref={this.form} model={form} rules={this.state.rules} labelWidth='80'>
          <Row>
            <Col span={12}>

              <Form.Item label='名称' prop='name'>
                <Input value={form.name} placeholder={'name'} onChange={this.handleChange.bind(this, 'name')}/>
              </Form.Item>
              <Form.Item label='数量' prop='count'>
                <Input value={form.count} placeholder={'count'} onChange={this.handleChange.bind(this, 'count')}/>
              </Form.Item>
              <Form.Item label='地区' prop='region'>
                <Radio
                  list={['北京', '上海', '重庆']}
                  checked={checkedIndex}
                  onChange={this.handleChange.bind(this, 'region','')}
                />
              </Form.Item>
              <Form.Item>
                <Button type='primary' onClick={this.handleSubmit.bind(this)}>提交</Button>
                <Button onClick={this.cancelSubmit.bind(this)}>重置</Button>
              </Form.Item>

            </Col>
          </Row>
        </Form>
      </div>
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
