import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Radio from '../../../components/radio'
const prefix = 'radio-noraml'
const code = `
import React from 'react'
import Radio from '@hiui/hiui/es/radio'\n
class Demo extends React.Component {
  render() {
    return <React.Fragment>
      <Radio autoFocus>Radio</Radio>
      <Radio defaultChecked>默认选择</Radio>
    </React.Fragment>
  }
}`

const DemoNormal = () => (
  <DocViewer code={code} scope={{ Radio }} prefix={prefix} />
)
export default DemoNormal
