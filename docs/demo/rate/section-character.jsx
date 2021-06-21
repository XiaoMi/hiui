import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import { LegacyForm } from '../../../components/form'
import Icon from '../../../components/icon'
import Rate from '../../../components/rate'
import logoPng from '../../../site/static/img/docs/mi-logo@2x.png'
const desc = '元素可以是字体图标，文字甚至图片。'
const prefix = 'rate-character'
const code = `import React from 'react'
import Rate from '@hi-ui/hiui/es/rate'
import LegacyForm from '@hi-ui/hiui/es/form'
import Icon from '@hi-ui/hiui/es/icon'

class Demo extends React.Component {
  constructor() {
    super()
  }
  render() {
    const FormItem = LegacyForm.Item
    return (
      <LegacyForm labelWidth="80px" labelPosition="left">
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
      </LegacyForm>
    )
  }
}`
const DemoAdvanced = () => (
  <DocViewer code={code} scope={{ LegacyForm, Rate, Icon, logoPng }} prefix={prefix} desc={desc} />
)
export default DemoAdvanced
