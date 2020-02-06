import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Button from '../../../components/button'
const prefix = 'form-row'
const desc = '适用于筛选或查询数据的场景，和表格配合使用'
const code = `import React from 'react'
import { Form, Input } from '@hi-ui/hiui'
class Demo extends React.Component {
  render (){
    const FormItem = Form.Item
    return (
      <Form placement='horizontal' labelPlacement='right'>
        <FormItem label='账号' labelWidth='50'>
          <Input placeholder={'请输入'} />
        </FormItem>
        <FormItem label='密码' labelWidth='50'>
          <Input type='password' placeholder={'请输入'} />
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
    desc={desc}
  />
)
export default DemoRow
