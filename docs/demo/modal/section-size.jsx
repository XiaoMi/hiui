import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Modal from '../../../components/modal'
import Radio from '../../../components/radio'
const desc = '通过 size 自定义尺寸，可使用 large、default、small，默认为 default'
const prefix = 'modal-size'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Modal from '@hi-ui/hiui/es/modal'
import Radio from '@hi-ui/hiui/es/radio'\n
class Demo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      size: 'default',
      sizeList: [
        {
          name: '标准',
          id: 'default'
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
          legacy
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
        >
          <span>一些消息</span>
          <span>一些消息</span>
        </Modal>

      </div>
    )
  }
}`
const DemoSize = () => (
  <DocViewer code={code} scope={{ Button, Modal, Radio }} prefix={prefix} desc={desc} />
)
export default DemoSize
