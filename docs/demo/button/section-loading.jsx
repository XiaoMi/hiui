import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Message from '../../../components/message'
const prefix = 'button-loading'
const desc = '请求服务器发生延迟时或缓冲状态，使用加载中进行状态说明'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Message from '@hi-ui/hiui/es/message'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      loading: false
    }
  }
  render () {
    const { loading } = this.state
    return (
      <React.Fragment>
        <Button loading type="primary">提交</Button>
        <Button loading type="line">提交</Button>
        <Button loading type="line" icon="delete" />
        <Button loading type="danger" icon="delete" />
      </React.Fragment>
    )
  }
}`

export default () => (
  <DocViewer
    code={code}
    scope={{ Button, Message }}
    prefix={prefix}
    desc={desc}
  />
)
