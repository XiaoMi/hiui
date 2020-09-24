import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Message from '../../../components/message'
const prefix = 'message-delay'
const desc = '自定义消息的关闭延时'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Message from '@hi-ui/hiui/es/message'\n
class Demo extends React.Component {
  render(){
    return(
      <div>
        <Button type="primary" onClick={this.open}>延时消息</Button>
      </div>
    )
  }

  open() {
    Message.open({
      title:'操作成功，延时6000毫秒',
      duration: 6000
    })
  }
}`

const DemoDealy = () => <DocViewer code={code} scope={{ Button, Message }} prefix={prefix} desc={desc} />
export default DemoDealy
