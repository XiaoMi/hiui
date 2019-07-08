import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Alert from '../../../components/alert'
const prefix = 'alert-base'
const code = `
import React from 'react'
import Alert from '@hi-ui/hiui/es/alert'\n
class Demo extends React.Component {
  render () {
    return (
      <div>
        <Alert type="info" message="信息提示的文案" onClose={()=>{console.log('alert关闭回调')}} />
        <br />
        <Alert type="success" message="成功提示的文案" onClose={()=>{console.log('alert关闭回调')}} />
        <br />
        <Alert type="error" message="错误提示的文案" onClose={()=>{console.log('alert关闭回调')}} />
        <br />
        <Alert type="warning" message="警示提示的文案" onClose={()=>{console.log('alert关闭回调')}} />
      </div>
    )
  }
}`

const DemoBase = () => <DocViewer code={code} scope={{ Alert }} prefix={prefix} />
export default DemoBase
