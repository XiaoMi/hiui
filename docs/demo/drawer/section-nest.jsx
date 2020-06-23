import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Modal from '../../../components/modal'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
const desc = '未传入 title 及 closeable 为 false，可取消 title 部分，footer 为 null，可取消底部按钮'
const prefix = 'modal-nest'
const code = `import React from 'react'
import { Input, Form, Button, Modal } from '@hi-ui/hiui'\n
class Demo extends React.Component {
  constructor (props) {
    super(props)
    this.form = React.createRef()
    this.state = {
      visible: false,
      form: {
        name: '',
        count: '',
        bank: '',
        pwd: ''
      },
      checkedIndex: -1,
      rules: {
        name: {
          required: true,
          message: <span style={{color: '#ccc'}}>请输入名称</span>,
          trigger: 'onBlur,onChange'
        },
        count: {
          required: true,
          message: '请输入数量',
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
  clickEvent () {
    this.setState({
      visible: false
    })
    console.log("关闭事件")
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
    const FormItem = Form.Item
    const { form, checkedIndex } = this.state
    return(
      <div>
        <Button type="primary" onClick={() => this.setState({visible: true})}>打开</Button>
        <Modal
          title="新建"
          closeable={false}
          visible={this.state.visible}
          onConfirm={this.clickEvent.bind(this)}
          onCancel={this.clickEvent.bind(this)}
        >
          <Form ref={this.form} model={form} rules={this.state.rules} labelWidth='80' labelPlacement='right'>
            <FormItem label='姓名' field='name'>
              <Input value={form.name} placeholder='name' onChange={this.handleChange.bind(this, 'name')}/>
            </FormItem>
            <FormItem label='账户' field='count'>
              <Input value={form.count} placeholder='count' onChange={this.handleChange.bind(this, 'count')}/>
            </FormItem>
            <FormItem label='开户行' field='name'>
              <Input value={form.bank} placeholder='bank' />
            </FormItem>
            <FormItem label='密码' field='count'>
              <Input value={form.pwd} placeholder='pwd' />
            </FormItem>
          </Form>
        </Modal>

      </div>
    )
  }
}`
const DemoNest = () => (
  <DocViewer code={code} scope={{ Button, Modal, Input, Form }} prefix={prefix} desc={desc} />
)
export default DemoNest
