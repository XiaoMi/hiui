import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Notification from '../../../components/notification'
const prefix = 'notification-base'
const code = `
import React from 'react'
import Button from '@hiui/hiui/es/button'
import Notification from '@hiui/hiui/es/notification'\n
class Demo extends React.Component {
  render(){
    return(
      <div>
        <Button type="success" onClick={this.open.bind(this)}>自动关闭</Button>
        <Button type="info" onClick={this.open1.bind(this)}>不自动关闭</Button>
      </div>
    )
  }

  open(){
    Notification.open({
      title:'通知',
      content:'通知内容',
    })
  }
  open1(){
    Notification.open({
      title:'通知',
      content:'通知内容',
      duration:null,
    })
  }
}`

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Button, Notification }}
    prefix={prefix}
  />
)
export default DemoBase
