import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Message from '../../../components/message'
const prefix = 'message-type'
const desc = '对操作结果的明确反馈，自动关闭'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Message from '@hi-ui/hiui/es/message'\n
class Demo extends React.Component {
  render(){
    return(
      <div>
        <Button type="primary" onClick={this.openSuccess}>成功消息</Button>
        <Button type="primary" onClick={this.openError}>错误消息</Button>
        <Button type="primary" onClick={this.openWarning}>警示消息</Button>
      </div>
    )
  }

  openSuccess() {
    Message.open({
      type:'success',
      title:'操作成功'
    })
  }
  openError() {
    Message.open({
      type:'error',
      title:'网络错误，请重新连接'
    })
  }
  openWarning() {
    Message.open({
      type:'warning',
      title:'操作风险，请谨慎操作'
    })
  }
}`

const DemoType = () => <DocViewer code={code} scope={{ Button, Message }} prefix={prefix} desc={desc} />
export default DemoType
