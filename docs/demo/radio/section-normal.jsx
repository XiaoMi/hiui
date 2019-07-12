import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Radio from '../../../components/radio'
import Button from '../../../components/button'
const prefix = 'radio-noraml'
const code = `
import React from 'react'
import Button from '@hi-ui/hiui/es/button'
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

const DemoNormal = () => <DocViewer code={code} scope={{ Radio, Button }} prefix={prefix} />
export default DemoNormal
