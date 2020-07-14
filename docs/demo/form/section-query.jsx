import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Button from '../../../components/button'
import Grid from '../../../components/grid'

const prefix = 'form-query'
const desc = '适用于多个筛选或查询数据'
const code = `import React from 'react'
import { Form, Input, Grid } from '@hi-ui/hiui'
class Demo extends React.Component {
  constructor () {
    super()
    this.state={
      filesCount: 6
    }
    this.form = React.createRef()
  }
  renderField () {
    const {filesCount} =this.state

    const formItems = [];
    for (let i = 0; i < filesCount; i++) {
      formItems.push(
          <Form.Item
            field={'field'+i}
            label={'Field'+i}
            key={'field'+i}
            rules={[
              {
                required: true,
                message: 'Input something!',
              },
            ]}
          >
            <Input placeholder="placeholder" style={{ width: 200 }}/>
          </Form.Item>
      );
    }

    return formItems
  }
  
  render (){
    const FormItem = Form.Item
    const FormSubmit = Form.Submit
    const {filesCount} = this.state
    const Row = Grid.Row
    const Col = Grid.Col
    return (
      <div style={{width:'860px'}}>
        <Form placement='horizontal' labelPlacement='right' ref={this.form}>
          {
            this.renderField()
          }
        </Form>
        <div style = {{textAlign: 'right', paddingRight: '34px'}}>
          <Button type="primary"  onClick={()=>{
            console.log('填充表单')
            this.form.current.validate((values,errors)=>{
              console.log('Get form value:',values,errors)
            })
          }}
          >
          查询
        </Button>
        <Button type="line"  onClick={()=>{
            this.form.current.resetValidates(()=>{
              console.log('重置表单')
            })
         }}
         
        >
        重置
        </Button>
        <Button type="line" appearance="link" icon={filesCount === 9 ? "up":"down"} onClick={()=>{
          this.form.current.resetValidates(()=>{
            console.log('重置表单')
          })
          this.setState({
            filesCount: filesCount === 9 ? 6:9
          })
        }}>{filesCount === 9 ? '收起':'展开更多'}</Button>
      </div>
    </div>
    )
  }
}`

const DemoRow = () => (
  <DocViewer
    code={code}
    scope={{ Form, Button, Input, Grid }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoRow
