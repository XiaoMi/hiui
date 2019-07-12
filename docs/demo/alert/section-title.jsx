import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Alert from '../../../components/alert'
const prefix = 'alert-title'
const code = `
import React from 'react'
import Alert from '@hiui/hiui/es/alert'\n
class Demo extends React.Component {
  render () {
    return (
      <div>
        <Alert type="info" title="信息提示的文案" content="文字说明文字说明文字说明文字说明文字说明文字说明" onClose={()=>{console.log('alert关闭回调')}} />
        <br />
        <Alert type="success" title="成功提示的文案" content="文字说明文字说明文字说明文字说明文字说明文字说明" onClose={()=>{console.log('alert关闭回调')}} />
        <br />
        <Alert type="error" title="错误提示的文案" content="文字说明文字说明文字说明文字说明文字说明文字说明" onClose={()=>{console.log('alert关闭回调')}} />
        <br />
        <Alert type="warning" title="警示提示的文案" content="文字说明文字说明文字说明文字说明文字说明文字说明" onClose={()=>{console.log('alert关闭回调')}} />
      </div>
    )
  }
}`
const DemoTitle = () => <DocViewer code={code} scope={{ Alert }} prefix={prefix} />
export default DemoTitle
