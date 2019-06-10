import React from 'react'
import DocViewer from '../../../../libs/doc-viewer'
import Alert from '../../../../components/alert'
const prefix = 'alert-closeable'

const code = `
import React from 'react'
import Alert from '@hiui/hiui/es/alert'\n
class Demo extends React.Component {
  render () {
    return (
      <div>
        <Alert type="info" message="信息提示的文案" closeable={false} />
        <br />
        <Alert type="success" message="成功提示的文案" closeable={false} />
        <br />
        <Alert type="error" message="错误提示的文案" closeable={false} />
        <br />
        <Alert type="warning" message="警示提示的文案" closeable={false} />
      </div>
    )
  }
}`
const DemoCloseable = () => (
  <DocViewer
    code={code}
    scope={{ Alert }}
    prefix={prefix}
  />
)
export default DemoCloseable
