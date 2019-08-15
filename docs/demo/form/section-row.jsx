import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Button from '../../../components/button'
const prefix = 'form-row'
const code = `import React from 'react'
import { Form, Input } from '@hi-ui/hiui'
class Demo extends React.Component {
  render (){
    const FormItem = Form.Item
    return (
      <Form placement='horizontal' labelPlacement='right'>
        <FormItem label='账号' labelWidth='50'>
          <Input placeholder={'账号'} />
        </FormItem>
        <FormItem label='密码' labelWidth='50'>
          <Input type='password' placeholder={'密码'} />
        </FormItem>
        <FormItem>
          <Button type={'primary'}>提交</Button>
        </FormItem>
      </Form>
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
