import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Radio from '../../../components/radio'
const prefix = 'radio-type'
const code = `
import React from 'react'
import Radio from '@hiui/hiui/es/radio'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.data = [{
      id: 0,
      content: '手机',
      disabled: true
    }, {
      id: 1,
      content: 'AI'
    }, {
      id: 2,
      content: 'IOT'
    }]
  }

  render() {
    return <React.Fragment>
      <Radio.Group type='button' defaultValue='AI' data={['手机', 'AI', 'IOT']} />
      <p />
      <Radio.Group type='button' defaultValue='AI' data={['手机', 'AI', 'IOT']} disabled />
      <p />
      <Radio.Group type='button' defaultValue={1} data={this.data} />
    </React.Fragment>
  }
}`
const DemoType = () => (
  <DocViewer
    code={code}
    scope={{ Radio }}
    prefix={prefix}
    desc='使用按钮样式'
  />
)
export default DemoType
