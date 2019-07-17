import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Radio from '../../../components/radio'
const prefix = 'radio-type'
const code = `
import React from 'react'
import Radio from '@hi-ui/hiui/es/radio'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.list = [{
      id: 0,
      content: '手机类'
    }, {
      id: 1,
      content: '电脑类',
      disabled: true
    }, {
      id: 2,
      content: '生活类'
    }, {
      id: 3,
      content: '其它'
    }]
  }
  render() {
    return (
      <Radio.Group
        data={this.list}
        type='button'
        defaultValue={0}
        onChange={(data) => console.log(data)}
      />
    )
  }
}`
const DemoType = () => (
  <DocViewer
    code={code}
    scope={{ Radio }}
    prefix={prefix}
  />
)
export default DemoType
