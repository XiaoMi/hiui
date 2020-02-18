import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Notification from '../../../components/notification'
const prefix = 'notification-base'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Notification from '@hi-ui/hiui/es/notification'\n
class Demo extends React.Component {
  render(){
    return(
      <div>
        <Button type="success" onClick={this.open.bind(this)}>自动关闭</Button>
        <Button onClick={this.openManual.bind(this)}>不自动关闭</Button>
        <Button onClick={this.openTitle.bind(this)}>通知内容</Button>
        <Button onClick={this.openContent.bind(this)}>标题+通知内容</Button>
        <Button onClick={this.openConfirm.bind(this)}>标题+通知内容+操作</Button>
      </div>
    )
  }

  open(){
    Notification.open({
      title:'通知',
      content:'通知内容',
    })
  }
  openManual(){
    Notification.open({
      title:'通知',
      content:'通知内容',
      duration:null,
    })
  }
  openTitle(){
    Notification.open({
      title:'停电通知，明早8:00公司停电'
    })
  }
  openContent(){
    Notification.open({
      title:'数据备份通知',
      content:'各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作，以防丢失。带来不便，敬请谅解！'
    })
  }
  openConfirm(){
    Notification.open({
      title:'数据备份通知',
      content:'各位同学请注意，将于2019.08.10 00:00:00 -08:00：00 期间进行系统服务器升级维护，请做好数据备份工作…',
      confirmText:'查看详情',
      onConfirm:()=>{}
    })
  }
}`

const DemoBase = () => <DocViewer code={code} scope={{ Button, Notification }} prefix={prefix} />
export default DemoBase
