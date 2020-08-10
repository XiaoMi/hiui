import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import FormItem from '../../../components/form/Item'
import Rate from '../../../components/rate'
const prefix = 'rate-base'
const desc = '评定业务指标、信用等级、满意度等'
const code = `import React from 'react'
import Rate from '@hi-ui/hiui/es/rate'
import Form from '@hi-ui/hiui/es/form/index'
import FormItem from '@hi-ui/hiui/es/form/item'\n
class Demo extends React.Component {
  constructor(props){
    super(props)
    this.state ={
      value:3
    }
  }
  render() {
    const {value} = this.state
    return (
      <Form labelWidth="80px" labelPosition="left">
        <FormItem label="基础">
          <Rate  defaultValue={3}/>
        </FormItem>
        <FormItem label="受控">
          <Rate value={value} onChange={(v)=>{
            this.setState({
            value:v
            })
          }}/>
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
    desc={desc}
  />
)
export default DemoBase
