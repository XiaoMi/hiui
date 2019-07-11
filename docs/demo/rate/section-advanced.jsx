import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import FormItem from '../../../components/form/Item'
import Rate from '../../../components/rate'
const prefix = 'rate-advanced'
const code = `
import React from 'react'
import Rate from '@hiui/hiui/es/rate'
import Form from '@hiui/hiui/es/form/index'
import FormItem from '@hiui/hiui/es/form/item'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state = {
      value: 3
    }
    this.tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful']
  }

  render() {
    const { value } = this.state
    return (
      <Form labelWidth="80px" labelPosition="left">
        <FormItem label="任意数量">
          <Rate count={10} allowHalf defaultValue={9.5} />
        </FormItem>
        <FormItem label="提示">
          <Rate tooltips={this.tooltips} onChange={value => {
            this.setState({value})
          }} value={value} />
        </FormItem>
        <FormItem label="禁用">
          <Rate allowHalf disabled defaultValue={2.5} />
        </FormItem>
        <FormItem label="禁止清除">
          <Rate allowHalf allowClear={false} defaultValue={2.5} />
        </FormItem>
      </Form>
    )
  }
}`
const DemoAdvanced = () => (
  <DocViewer
    code={code}
    scope={{ Form, FormItem, Rate }}
    prefix={prefix}
  />
)
export default DemoAdvanced
