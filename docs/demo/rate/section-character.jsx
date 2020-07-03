import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Form from '../../../components/form/index'
import FormItem from '../../../components/form/Item'
import Icon from '../../../components/Icon'
import Rate from '../../../components/rate'
import logoPng from '../../../site/static/img/docs/mi-logo@2x.png'
const desc = '元素可以是字体图标，文字甚至图片。'
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
          <Rate count={5} allowHalf defaultValue={2.5} character={<Icon name="collection"/>} color='#4284f5'/>
        </FormItem>
        <FormItem label="文字">
          <Rate count={5} allowHalf defaultValue={2.5} character='米' style={{fontSize:22}} color='#FF6633'/>
        </FormItem>
        <FormItem label="字母">
          <Rate count={5} allowHalf defaultValue={2.5} character='HIUI' style={{fontSize: 22}} color='#46BC99'/>
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
    desc={desc}
  />
)
export default DemoAdvanced
