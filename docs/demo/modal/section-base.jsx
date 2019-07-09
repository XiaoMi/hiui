import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Modal from '../../../components/modal'
const prefix = 'modal-base'
const code = `
import React from 'react'
import Button from '@hiui/hiui/es/button'
import Modal from '@hiui/hiui/es/modal'\n
class Demo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false
    }
  }
  cancelEvent () {
    this.setState({
      visible: false
    })
    console.log("自定义关闭事件")
  }
  render(){
    return(
      <div>
        <Button type="primary" onClick={() => this.setState({visible: true})}>打开</Button>
        <Modal
          title="提示消息"
          visible={this.state.visible}
          onConfirm={()=>{console.log('自定义确定事件')}}
          onCancel={this.cancelEvent.bind(this)}
        >
          <span>一些消息</span>
          <span>一些消息</span>
        </Modal>
      </div>
    )
  }
}`

const DemoBase = () => <DocViewer code={code} scope={{ Button, Modal }} prefix={prefix} />
export default DemoBase
