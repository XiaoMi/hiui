import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Alert from '../../../components/alert'
const prefix = 'alert-closeable'
const desc = '反馈信息较为重要，需要引导用户阅读或关注'

const code = `import React from 'react'
import Alert from '@hi-ui/hiui/es/alert'\n
class Demo extends React.Component {
  render () {
    return (
      <div>
        <Alert type="primary" title="信息提示的文案" closeable={false}  />
        <br />
        <Alert type="success" title="成功提示的文案" closeable={false}  />
        <br />
        <Alert type="danger" title="错误提示的文案" closeable={false}  />
        <br />
        <Alert type="warning" title="警示提示的文案" closeable={false}  />
      </div>
    )
  }
}`
const DemoCloseable = () => <DocViewer desc={desc} code={code} scope={{ Alert }} prefix={prefix} />
export default DemoCloseable
