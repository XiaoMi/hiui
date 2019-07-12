import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Modal from '../../../components/modal'
const prefix = 'modal-base'
const code = `
import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Modal from '@hi-ui/hiui/es/modal'\n
class Demo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false
    }
  }
  cancelEvent () {
    this.setState({
      show: false
    })
    console.log("自定义关闭事件")
  }
  render(){
    return(
      <div>
        <Button type="primary" onClick={() => this.setState({show: true})}>打开</Button>
        <Modal
          title="提示消息"
          show={this.state.show}
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
