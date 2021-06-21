import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Modal from '../../../components/modal'
import Icon from '../../../components/icon'
const prefix = 'modal-tip'
const desc = '用户在界面交互过程中的行为确认'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Icon from '@hi-ui/hiui/es/icon'
import Modal from '@hi-ui/hiui/es/modal'\n
class Demo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visibleError: false,
      visibleWarning: false
    }
  }
  cancelEventError () {
    this.setState({
      visibleError: false
    })
    console.log("取消错误事件")
  }
  cancelEventWarning () {
    this.setState({
      visibleWarning: false
    })
    console.log("取消警告事件")
  }
  render(){
    return(
      <div>
        <Button type="primary" onClick={() => Modal.confirm({type: 'error', title: '错误', content: <div style={{lineHeight: '48px'}}>操作失败，请联系管理员！</div>, cancelText: null, confirmText:'我知道了'})}>打开错误提示</Button>
        <Button type="primary" onClick={() => Modal.confirm({type:'warning', title:'警告', content: <div style={{lineHeight: '48px'}}>执行该操作后将无法撤销，是否确定继续？</div>, cancelText: null, confirmText:'确定'})}>打开警告提示</Button>
      </div>
    )
  }
}`

const DemoTip = () => <DocViewer code={code} scope={{ Button, Modal, Icon }} prefix={prefix} desc={desc} />
export default DemoTip
