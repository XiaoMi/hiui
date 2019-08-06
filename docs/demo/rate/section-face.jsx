import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import FormItem from '../../../components/form/Item'
import Rate from '../../../components/rate'
import Alert from '../../../components/alert'
const prefix = 'rate-face'

const code = `import React from 'react'
import Rate from '@hi-ui/hiui/es/rate'
import Form from '@hi-ui/hiui/es/form/index'
import FormItem from '@hi-ui/hiui/es/form/item'
import Alert from '@hi-ui/hiui/es/alert'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful']
  }

  render() {
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
    scope={{ Form, FormItem, Rate, Alert }}
    prefix={prefix}
  />
)
export default DemoBase
