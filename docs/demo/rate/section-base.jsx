import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import FormItem from '../../../components/form/Item'
import Rate from '../../../components/rate'
const prefix = 'rate-base'
const code = `
import React from 'react'
import Rate from '@hiui/hiui/es/rate'
import Form from '@hiui/hiui/es/form/index'
import FormItem from '@hiui/hiui/es/form/item'\n
class Demo extends React.Component {
  render() {
    return (
      <Form labelWidth="80px" labelPosition="left">
        <FormItem label="基础">
          <Rate defaultValue={3} />
        </FormItem>
        <FormItem label="半星">
          <Rate allowHalf defaultValue={2.5} />
        </FormItem>
      </Form>
    )
  }
}`

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Form, FormItem, Rate }}
    prefix={prefix}
  />
)
export default DemoBase
