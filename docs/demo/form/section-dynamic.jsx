import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Button from '../../../components/button'
import Grid from '../../../components/grid'

const prefix = 'form-dynamic'
const desc = '动态增减嵌套字段'
const code = `import React from 'react'
import { Form, Input, Grid } from '@hi-ui/hiui'
class Demo extends React.Component {
  constructor () {
    super()
    this.form = React.createRef()
  }
  renderField () {
    const formItems = [];
    const count = 9
    for (let i = 0; i < count; i++) {
      formItems.push(
          <Form.Item
            field={'field'+i}
            label={'Field'+i}
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
    const Row = Grid.Row
    const Col = Grid.Col
    
    return (
      <div style={{minWidth:'864px'}}>
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
