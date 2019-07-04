import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import FormItem from '../../../components/form/item'
import Input from '../../../components/input'
import Button from '../../../components/button'
const prefix = 'form-row'
const code = `
import React from 'react'
import FormItem from '@hiui/hiui/es/form/item'
import Input from '@hiui/hiui/es/input'
import Form from '@hiui/hiui/es/form/index'\n
class Demo extends React.Component {
  render(){
    return (
      <div>
        <div>
           <Form inline={true}>
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
         </div>
      </div>
    )
  }
}`

const DemoRow = () => (
  <DocViewer
    code={code}
    scope={{ Form, FormItem, Button, Input }}
    prefix={prefix}
  />
)
export default DemoRow
