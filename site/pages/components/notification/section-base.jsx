import React from 'react'
import DocViewer from '../../../../libs/doc-viewer'
import Button from '../../../../components/button'
import { handleNotificate } from '../../../../components/notification'
const prefix = 'notification-base'
const code = `
import React from 'react'
import Button from '@hiui/hiui/es/button'
import { handleNotificate } from '@hiui/hiui/es/notification'\n
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
    handleNotificate({type: 'success', duration: 5000, showClose:false,autoClose:true,title:'标题',message:'自动关闭通知框',onClose:()=>{console.log('关闭回调')}})
  }
  open1(){
    handleNotificate({autoClose:false,title:'标题',message:'手动关闭通知框',onClose:()=>{console.log('关闭回调')}})
  }
}`

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Button, handleNotificate }}
    prefix={prefix}
  />
)
export default DemoBase
