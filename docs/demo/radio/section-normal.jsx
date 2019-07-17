import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Radio from '../../../components/radio'
const prefix = 'radio-type'
const code = `
import React from 'react'
import Radio from '@hi-ui/hiui/es/radio'\n
class Demo extends React.Component {
  render() {
    return (
      <Radio.Group
        data={['手机类', '电脑类', '生活类', '其它']}
        defaultValue='手机类'
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
