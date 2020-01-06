import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Modal from '../../../components/modal'
const prefix = 'modal-ask'
const desc = '用户在界面交互过程中的行为确认'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Modal from '@hi-ui/hiui/es/modal'\n
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
    console.log("取消事件")
  }
  render(){
    return(
      <div>
        <Button type="primary" onClick={() => this.setState({visible: true})}>打开</Button>
        <Modal
          title="提示"
          visible={this.state.visible}
          onConfirm={()=>{console.log('自定义确定事件')}}
          onCancel={this.cancelEvent.bind(this)}
        >
          <span>您还没保存，退出会导致数据丢失，确定退出吗？</span>
        </Modal>
      </div>
    )
  }
}`

const DemoAsk = () => <DocViewer code={code} scope={{ Button, Modal }} prefix={prefix} desc={desc} />
export default DemoAsk
