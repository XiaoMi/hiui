import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import FormItem from '../../../components/form/Item'
import Icon from '../../../components/Icon'
import Rate from '../../../components/rate'
import logoPng from '../../../site/static/img/logo.png'
const prefix = 'rate-character'
const code = `import React from 'react'
import Rate from '@hi-ui/hiui/es/rate'
import Form from '@hi-ui/hiui/es/form/index'
import Icon from '@hi-ui/hiui/es/icon'

import FormItem from '@hi-ui/hiui/es/form/item'\n
class Demo extends React.Component {
  constructor() {
    super()
  }
  render() {
    return (
      <Form labelWidth="80px" labelPosition="left">
        <FormItem label="Icon">
          <Rate count={5} allowHalf defaultValue={2.5} character={<Icon name="check-circle-o"/>} color='#4284f5'/>
        </FormItem>
        <FormItem label="文字">
          <Rate count={5} allowHalf defaultValue={2.5} character='米' showDesc/>
        </FormItem>
        <FormItem label="字母">
          <Rate count={5} allowHalf defaultValue={2.5} character='HIUI' style={{fontSize: 30}} color='#1da653'/>
        </FormItem>
        <FormItem label="图片">
          <Rate count={5} allowHalf defaultValue={2.5} character={<img src={logoPng} style={{width:24,height:24}}/>}/>
        </FormItem>
      </Form>
    )
  }
}`
const DemoAdvanced = () => (
  <DocViewer
    code={code}
    scope={{ Form, FormItem, Rate, Icon, logoPng }}
    prefix={prefix}
  />
)
export default DemoAdvanced
