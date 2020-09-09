import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import { Form } from '../../../components/form'
import Rate from '../../../components/rate'
import Alert from '../../../components/alert'

const prefix = 'rate-face'
const desc = '运用图标直观表达评级结果的优劣'
const code = `import React from 'react'
import Rate from '@hi-ui/hiui/es/rate'
import Form from '@hi-ui/hiui/es/form'
import Alert from '@hi-ui/hiui/es/alert'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.tooltips = ['极差','失望', '一般', '满意','很满意']
  }

  render() {
    const FormItem = Form.Item
    return (
      <Form labelWidth="80" labelPosition="left">
        <Alert type="warning" title="使用表情后将不可自定义数量，不可定义半星" closeable={false} />
        <br />
        <FormItem label="基础">
          <Rate defaultValue={3} useEmoji />
        </FormItem>
        <FormItem label="提示">
          <Rate defaultValue={3} useEmoji tooltips={this.tooltips} />
        </FormItem>
        <FormItem label="禁用">
          <Rate defaultValue={3} useEmoji disabled />
        </FormItem>
        <FormItem label="只读">
          <Rate defaultValue={3} useEmoji readOnly />
        </FormItem>
        <FormItem label="禁止清除">
          <Rate defaultValue={3} useEmoji clearable={false} />
        </FormItem>
      </Form>
    )
  }
}`
const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Form, Rate, Alert }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoBase
