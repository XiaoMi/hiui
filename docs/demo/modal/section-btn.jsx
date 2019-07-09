import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Modal from '../../../components/modal'
const prefix = 'modal-btn'
const desc = '通过 footers 自定义底部的按钮，并执行对应自定义事件，通过 closeBtn 取消右上角关闭按钮'

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
    console.log("关闭事件")
  }
  render(){
    return(
      <div>
        <Button type="primary" onClick={() => this.setState({visible: true})}>打开</Button>
        <Modal
          title="提示消息"
          closeBtn={false}
          visible={this.state.visible}
          onConfirm={()=>{console.log('自定义确定事件')}}
          onCancel={this.cancelEvent.bind(this)}
          footer={[
            <Button type="primary" key={0} onClick={() => console.log(1)}>自定义按钮1</Button>,
            <Button type="success" key={1} onClick={() => console.log(2)}>自定义按钮2</Button>,
            <Button type="danger" key={2} onClick={() => console.log(3)}>自定义按钮3</Button>,
            <Button type="default" key={3} onClick={this.cancelEvent.bind(this)}>关闭</Button>
          ]}
        >
          <span>一些消息</span>
          <span>一些消息</span>
        </Modal>

      </div>
    )
  }
}`
const DemoBtn = () => (
  <DocViewer code={code} scope={{ Button, Modal }} prefix={prefix} desc={desc} />
)
export default DemoBtn
