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
        <Button type="primary" onClick={() => this.setState({visibleError: true})}>打开错误提示</Button>
        <Button type="primary" onClick={() => this.setState({visibleWarning: true})}>打开警告提示</Button>
        <Modal
          title="提示"
          visible={this.state.visibleError}
          onCancel={this.cancelEventError.bind(this)}
          footers={[
            <Button type="primary" onClick={this.cancelEventError.bind(this)} >我知道了</Button>
          ]}
        >
          <div style={{display: 'flex'}}>
            <Icon name="close-circle" style={{color: '#EB5252', fontSize: '30px'}} />
            <div style={{marginLeft: '18px'}}>
                <span>错误标题</span><br/>
                <span style={{fontSize: '12px'}}>错误原因错误原因错误原因错误原因错误原因</span>
            </div>
          </div>  
        </Modal>
        <Modal
          title="提示"
          visible={this.state.visibleWarning}
          onCancel={this.cancelEventWarning.bind(this)}
          footers={[
            <Button type="primary" onClick={this.cancelEventWarning.bind(this)} >我知道了</Button>
          ]}
        >
          <div style={{display: 'flex'}}>
            <Icon name="info-circle" style={{color: '#4284F5', fontSize: '30px'}} />
            <div style={{marginLeft: '18px'}}>
              <span>警告标题</span><br/>
              <span style={{fontSize: '12px'}}>警告具体内容警告具体内容警告具体内容警告具体内容警告具体内容警告具体内容警告具体内容</span>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}`

const DemoTip = () => (
  <DocViewer
    code={code}
    scope={{ Button, Modal, Icon }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoTip
