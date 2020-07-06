import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import FormItem from '../../../components/form/Item'
import Rate from '../../../components/rate'
import Icon from '../../../components/Icon'
const prefix = 'rate-advanced'
const code = `import React from 'react'
import Rate from '@hi-ui/hiui/es/rate'
import Form from '@hi-ui/hiui/es/form/index'
import Icon from '@hi-ui/hiui/es/icon'
import FormItem from '@hi-ui/hiui/es/form/item'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state = {
      value: 3
    }
    this.tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful']
  }

  descRender (value, index) {
    const arr =['极差','差', '一般', '满意','很满意']
    return <span style={{color:'#FF6633'}}>{arr[Math.ceil(value)-1]} </span>;
  }
  render() {
    const { value } = this.state
    return (
      <Form labelWidth="120px" labelPosition="left">
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
        <FormItem label="只读">
          <Rate defaultValue={3} readOnly/>
        </FormItem>
        <FormItem label="禁止清除">
          <Rate allowHalf clearable={false} defaultValue={2.5} />
        </FormItem>
        <FormItem label="辅助文字">
          <Rate allowHalf descRender={this.descRender} defaultValue={0.5}/>
        </FormItem>
      </Form>
    )
  }
}`
const DemoAdvanced = () => (
  <DocViewer
    code={code}
    scope={{ Form, FormItem, Rate, Icon }}
    prefix={prefix}
  />
)
export default DemoAdvanced
