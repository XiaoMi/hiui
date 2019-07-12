import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Alert from '../../../components/alert'
const prefix = 'alert-autoClose'
const code = `
import React from 'react'
import Alert from '@hiui/hiui/es/alert'\n
class Demo extends React.Component {
  render () {
    return (
      <div>
        <Alert type="info" duration={3000} title="信息提示的文案"  closeable={false} onClose={()=>{console.log('alert关闭回调')}} />
        <br />
        <Alert type="success" duration={3000} title="成功提示的文案"  closeable={false} onClose={()=>{console.log('alert关闭回调')}} />
        <br />
        <Alert type="error" duration={3000} title="错误提示的文案"  closeable={false} onClose={()=>{console.log('alert关闭回调')}} />
        <br />
        <Alert type="warning" duration={3000} title="警示提示的文案"  closeable={false} onClose={()=>{console.log('alert关闭回调')}} />
      </div>
    )
  }
}`
const DemoAutoClose = () => <DocViewer code={code} scope={{ Alert }} prefix={prefix} />
export default DemoAutoClose
