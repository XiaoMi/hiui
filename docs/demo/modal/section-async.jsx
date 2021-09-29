import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Modal from '../../../components/modal'
const prefix = 'modal-async'
const desc = '通过 confirmLoading 控制确定按钮的 loading 状态，实现异步关闭'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Modal from '@hi-ui/hiui/es/modal'\n
class Demo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      loading: false
    }
  }
  cancelEvent () {
    this.setState({loading: true})
    setTimeout(()=>{
      this.setState({
        visible: false,
        loading: false
      })
    },1000) 
    console.log("自定义关闭事件")
  }
  render(){
    return(
      <div>
        <Button type="primary" onClick={() => this.setState({visible: true})}>打开</Button>
        <Modal
          title="提示消息"
          visible={this.state.visible}
          confirmLoading={this.state.loading}
          onConfirm={this.cancelEvent.bind(this)}
          onCancel={this.cancelEvent.bind(this)}
        >
          <span>一些消息....</span><br/>
          <span>一些消息...</span><br/>
          <span>一些消息...</span>
        </Modal>
      </div>
    )
  }
}`

const DemoAsync = () => <DocViewer code={code} desc={desc} scope={{ Button, Modal }} prefix={prefix} />
export default DemoAsync
