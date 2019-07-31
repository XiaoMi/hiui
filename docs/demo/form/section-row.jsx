import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form'
import Input from '../../../components/input'
import Button from '../../../components/button'
const prefix = 'form-row'
const code = `
import React from 'react'
import Input from '@hi-ui/hiui/es/input'
import Form from '@hi-ui/hiui/es/form'\n
class Demo extends React.Component {
  render(){
    return (
      <div>
        <div>
           <Form inline={true}>
              <Form.Item label='账号' labelWidth='50'>
                <Input placeholder={'账号'} />
              </Form.Item>
              <Form.Item label='密码' labelWidth='50'>
                <Input type='password' placeholder={'密码'} />
              </Form.Item>
              <Form.Item>
                <Button type={'primary'}>提交</Button>
              </Form.Item>
            </Form>
         </div>
      </div>
    )
  }
}`

const DemoRow = () => (
  <DocViewer
    code={code}
    scope={{ Form, Button, Input }}
    prefix={prefix}
  />
)
export default DemoRow
