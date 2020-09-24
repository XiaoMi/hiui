import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Message from '../../../components/message'
const prefix = 'message-base'
const desc = '一般提醒，不具有明确的引导倾向，自动关闭'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Message from '@hi-ui/hiui/es/message'\n
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
      title:'网络错误，清重新连接'
    })
  }
}`

const DemoBase = () => <DocViewer code={code} scope={{ Button, Message }} prefix={prefix} desc={desc} />
export default DemoBase
