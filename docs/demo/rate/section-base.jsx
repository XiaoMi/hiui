import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import { LegacyForm } from '../../../components/form'
import Rate from '../../../components/rate'
const prefix = 'rate-base'
const desc = '评定业务指标、信用等级、满意度等'
const code = `import React from 'react'
import Rate from '@hi-ui/hiui/es/rate'
import LegacyForm from '@hi-ui/hiui/es/form/index'
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
    const FormItem = LegacyForm.Item
    return (
      <LegacyForm labelWidth="80px" labelPosition="left">
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
      </LegacyForm>
    )
  }
}`

const DemoBase = () => <DocViewer code={code} scope={{ LegacyForm, Rate }} prefix={prefix} desc={desc} />
export default DemoBase
