import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Message from '../../../components/message'
const prefix = 'message-base'
const code = `
import React from 'react'
import Button from '@hiui/hiui/es/button'
import Message from '@hiui/hiui/es/message'\n
class Demo extends React.Component {
  render(){
    return(
      <div>
        <Button type="primary" onClick={this.open}>触发消息</Button>
      </div>
    )
  }

  open() {
    Message.open({
      title:'通知'
    })
  }
}`

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Button, Message }}
    prefix={prefix}
  />
)
export default DemoBase
