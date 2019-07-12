import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import FormItem from '../../../components/form/item'
import Rate from '../../../components/rate'
const prefix = 'rate-base'
const code = `
import React from 'react'
import Rate from '@hi-ui/hiui/es/rate'
import Form from '@hi-ui/hiui/es/form/index'
import FormItem from '@hi-ui/hiui/es/form/item'\n
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

const DemoBase = () => <DocViewer code={code} scope={{ Form, FormItem, Rate }} prefix={prefix} />
export default DemoBase
