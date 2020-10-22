import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Alert from '../../../components/alert'
const prefix = 'alert-title'
const desc = '反馈给用户的信息较多，需要用户阅读更详细'
const code = `import React from 'react'
import Alert from '@hi-ui/hiui/es/alert'\n
class Demo extends React.Component {
  render () {
    return (
      <div>
        <Alert type="primary" title="信息提示的文案" content="文字说明文字说明文字说明文字说明文字说明文字说明" onClose={()=>{console.log('alert关闭回调')}} />
        <br />
        <Alert type="success" title="成功提示的文案" content="文字说明文字说明文字说明文字说明文字说明文字说明" onClose={()=>{console.log('alert关闭回调')}} />
        <br />
        <Alert type="danger" title="错误提示的文案" content="文字说明文字说明文字说明文字说明文字说明文字说明" onClose={()=>{console.log('alert关闭回调')}} />
        <br />
        <Alert type="warning" title="警示提示的文案" content="文字说明文字说明文字说明文字说明文字说明文字说明" onClose={()=>{console.log('alert关闭回调')}} />
      </div>
    )
  }
}`
const DemoTitle = () => <DocViewer desc={desc} code={code} scope={{ Alert }} prefix={prefix} />
export default DemoTitle
