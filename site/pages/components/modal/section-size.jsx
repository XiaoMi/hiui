import React from 'react'
import DocViewer from '../../../../libs/doc-viewer'
import Button from '../../../../components/button'
import Modal from '../../../../components/modal'
import Radio from '../../../../components/radio'
const prefix = 'modal-size'
const code = `
import React from 'react'
import Button from '@hiui/hiui/es/button'
import Modal from '@hiui/hiui/es/modal'
import Radio from '@hiui/hiui/es/radio'\n
class Demo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      size: 'normal',
      sizeList: [
        {
          name: '标准',
          id: 'normal'
        },
        {
          name: '大',
          id: 'large'
        },
        {
          name: '小',
          id: 'small'
        }
      ],
      sizeListActive: 0
    }
  }
  cancelEvent () {
    this.setState({
      show: false
    })
    console.log("关闭事件")
  }
  render(){
    return(
      <div>
        <Radio
          list={this.state.sizeList}
          checked={this.state.sizeListActive}
          onChange={(data, index) => {
            this.setState({
              size: data,
              sizeListActive: index
            })
          }}
        />
        <Button type="primary" onClick={() => this.setState({show: true})}>打开</Button>
        <Modal
          title="窗口大小演示"
          size={this.state.size}
          show={this.state.show}
          onCancel={this.cancelEvent.bind(this)}
          footers={[
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
const DemoSize = () => (
  <DocViewer
    code={code}
    scope={{ Button, Modal, Radio }}
    prefix={prefix}
  />
)
export default DemoSize
